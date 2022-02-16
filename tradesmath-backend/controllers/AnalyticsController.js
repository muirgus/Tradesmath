const mongoose = require("mongoose");
const { cloneDeep, groupBy } = require("../lib/commonQuery");
const errorResponse = require("../middleware/error-response");
const {
  badRequestResponse,
  successResponse,
  notFoundResponse,
} = require("../middleware/response");
const ANSWERS = mongoose.model("answers");
const TOPICS = mongoose.model("topics");
const USER = mongoose.model("users");
const QUESTIONS = mongoose.model("questions");
const ANALYSIS = mongoose.model("analysis");

exports.analytics = {
  saveQuestions: async function (req, res) {
    try {
      const answers = {
        userId: req.user._id,
        questions: req.body.questions,
        score: req.body.score,
        topicId: req.body.topicId,
      };
      const isWrongQuestionExist = req.body.questions.filter(
        (x) => !x.isCorrect
      );
      if (isWrongQuestionExist.length > 0) {
        await isWrongQuestionExist.map(async (item) => {
          try {
            let isAnalysisExist = await ANALYSIS.findOne({
              questionId: item.questionId,
            });
            if (isAnalysisExist) {
              isAnalysisExist = cloneDeep(isAnalysisExist);
              isAnalysisExist.wrongAnswerCount += 1;
              const updateObj = {
                wrongAnswerCount: isAnalysisExist.wrongAnswerCount,
              };
              if (!isAnalysisExist.users.find((x) => x === req.user._id)) {
                isAnalysisExist.users.push(req.user._id);
                updateObj["users"] = isAnalysisExist.users;
              }
              await ANALYSIS.findOneAndUpdate(
                { _id: isAnalysisExist._id },
                {
                  $set: updateObj,
                }
              );
            } else {
              const createAnalysis = {
                questionId: item.questionId,
                wrongAnswerCount: 1,
                questionTemplateText: item.questionTemplate,
                topicId: req.body.topicId,
                users: [req.user._id],
              };
              await ANALYSIS.create(createAnalysis);
            }
          } catch (error) {}
        });
      }
      const isCreated = await ANSWERS.create(answers);
      if (isCreated) {
        return successResponse(res, {
          message: "Analytics created!",
        });
      } else
        return badRequestResponse(res, {
          message: "Failed to create analytics",
        });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getTopWrongAnswers: async function (req, res) {
    try {
      let top10WrongAnswers = await ANALYSIS.find()
        .sort({ wrongAnswerCount: -1 })
        .limit(10);
      top10WrongAnswers = cloneDeep(top10WrongAnswers);
      let topics = await TOPICS.find({
        _id: {
          $in: top10WrongAnswers.filter((x) => x.topicId).map((x) => x.topicId),
        },
      });
      topics = cloneDeep(topics);
      top10WrongAnswers = top10WrongAnswers.map((x) => {
        return {
          text: x.questionTemplateText,
          count: x.wrongAnswerCount,
          topicName: topics.find((y) => y._id === x.topicId)
            ? topics.find((y) => y._id === x.topicId).topicName
            : "",
        };
      });
      return successResponse(res, {
        data: {
          wrongAnswers: top10WrongAnswers,
        },
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getCounts: async function (req, res) {
    try {
      const superAdmin = await USER.count({
        isSuperAdmin: true,
        isAdmin: false,
      });
      const admins = await USER.count({
        isSuperAdmin: false,
        isAdmin: true,
      });
      const usersCount = await USER.count({
        isSuperAdmin: false,
        isAdmin: false,
      });
      const topicsCount = await TOPICS.count({});
      const questionsCount = await QUESTIONS.count({});
      return successResponse(res, {
        data: {
          usersCount: usersCount,
          superAdminCount: superAdmin,
          adminCount: admins,
          topicsCount: topicsCount,
          questionsCount: questionsCount,
        },
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getQuestionsBetween: async function (req, res) {
    try {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);
      const rangeFilter = {};
      if (req.body.startDate) {
        rangeFilter["$gte"] = startDate;
      }
      if (req.body.endDate) {
        rangeFilter["$lt"] = endDate;
      }
      let questionList = await ANSWERS.find({
        createdAt: rangeFilter,
      });
      questionList = cloneDeep(questionList);
      // questionList.map(
      //   (x) => (x.createdAt = this.getFormattedDate(new Date(x.createdAt)))
      // );
      const dateGroup = groupBy(questionList, (x) =>
        this.getFormattedDate(x.createdAt)
      ).map((x) => {
        return {
          date: this.getFormattedDate(x[0].createdAt),
          count: x.flatMap((y) => y.questions).length,
        };
      });
      const originalQuestions = await this.getAnalytics(req, res);
      originalQuestions.forEach((element) => {
        const isExist = dateGroup.find((x) => x.date === element.date);
        if (isExist) {
          isExist.count += element.count;
        } else {
          dateGroup.push(element);
        }
      });
      dateGroup.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });
      return successResponse(res, {
        data: {
          questions: dateGroup,
        },
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getFormattedDate: function (date) {
    let year = new Date(date).getFullYear();
    let month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    let day = new Date(date).getDate().toString().padStart(2, "0");

    return month + "/" + day + "/" + year;
  },
  getAnalytics: async function (req, res) {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const rangeFilter = {};
    if (req.body.startDate) {
      rangeFilter["$gte"] = startDate;
    }
    if (req.body.endDate) {
      rangeFilter["$lt"] = endDate;
    }
    let questionList = await QUESTIONS.find({
      createdAt: rangeFilter,
    });
    questionList = cloneDeep(questionList);
    // questionList.map(
    //   (x) => (x.createdAt = new Date(x.createdAt).toLocaleDateString())
    // );
    const dateGroup = groupBy(questionList, (x) =>
      this.getFormattedDate(x.createdAt)
    ).map((x) => {
      return {
        date: this.getFormattedDate(x[0].createdAt),
        count: x.length,
      };
    });
    return dateGroup;
  },
  getQuestionsBetweenOld: async function (req, res) {
    try {
      const dateGroup = await this.getAnalytics(req, res);
      return successResponse(res, {
        data: {
          questions: dateGroup,
        },
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
