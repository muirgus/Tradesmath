const mongoose = require("mongoose");
const { cloneDeep } = require("../lib/commonQuery");
const errorResponse = require("../middleware/error-response");
const {
  successResponse,
  badRequestResponse,
} = require("../middleware/response");
const TOPICS = mongoose.model("topics");
const QUESTIONS = mongoose.model("questions");
const ANSWERS = mongoose.model("answers");

exports.topic = {
  transformTopics: async function (req, res, allTopics) {
    const topicsObj = cloneDeep(allTopics);
    topicsObj.map((x) => delete x["__v"]);
    let topicQuestions = await QUESTIONS.find({
      topicId: {
        $in: topicsObj.map((x) => x._id),
      },
    });
    topicQuestions = cloneDeep(topicQuestions);
    let analysisAnswers = await ANSWERS.find({
      userId: req.user._id,
    });
    analysisAnswers = cloneDeep(analysisAnswers);
    topicsObj.map((x) => {
      x.questionsCount = topicQuestions.filter(
        (y) => y.topicId == x._id
      ).length;
      let currentAssessment = analysisAnswers.filter(
        (y) => y.topicId === x._id
      );
      if (currentAssessment.length > 0) {
        currentAssessment = [currentAssessment[currentAssessment.length - 1]];
      }
      x.totalScore = currentAssessment
        .flatMap((y) => y.score)
        .reduce((a, b) => parseInt(a) + parseInt(b), 0);
      x.totalQuestions = currentAssessment.flatMap((x) => x.questions).length;
      x.finalScore = Math.ceil((x.totalScore / x.totalQuestions) * 100);
      if (!x.finalScore) x.finalScore = 0;
    });
    return topicsObj;
  },
  getAllTopics: async function (req, res) {
    try {
      const allTopics = await TOPICS.find({});
      const topicsObj = await this.transformTopics(req, res, allTopics);
      return successResponse(res, {
        data: topicsObj,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  studentTopics: async function (req, res) {
    try {
      const allTopics = await TOPICS.find({
        $or: [
          {
            isActive: true,
          },
          {
            isActive: null,
          },
        ],
      });
      const topicsObj = await this.transformTopics(req, res, allTopics);
      return successResponse(res, {
        data: topicsObj,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getTopicsById: async function (req, res) {
    try {
      const topicId = req.query.topicId;
      const topic = await TOPICS.findOne({
        _id: topicId,
      });
      if (!topic) {
        return badRequestResponse(res, {
          message: "No topic found",
        });
      }
      const topicObj = cloneDeep(topic);
      let nextPrevTopics = [];
      if (topicObj.nextTopics) {
        nextPrevTopics = topicObj.nextTopics;
      }
      if (topicObj.prevTopics) {
        nextPrevTopics = nextPrevTopics.concat(topicObj.prevTopics);
      }
      nextPrevTopics = Array.from(new Set(nextPrevTopics));
      let nextPrevTopic = await TOPICS.find({
        _id: {
          $in: nextPrevTopics,
        },
      });
      topicObj.nextPrevTopics = cloneDeep(nextPrevTopic);
      delete topicObj["__v"];
      return successResponse(res, {
        data: topicObj,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  createTopics: async function (req, res) {
    try {
      const reqBody = req.body;
      const topics = {
        topicName: reqBody.topicName,
        topicMaterial: reqBody.topicMaterial,
        nextTopics: reqBody.nextTopics,
        prevTopics: reqBody.prevTopics,
        createdBy: req.user._id,
        isActive: reqBody.isActive,
      };
      var isCreated = await TOPICS.create(topics);
      if (isCreated)
        return successResponse(res, {
          message: "Topics created!",
        });
      else
        return badRequestResponse(res, {
          message: "Failed to create topic",
        });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  updateTopics: async function (req, res) {
    try {
      const reqBody = req.body;
      let topic = await TOPICS.findOne({ _id: reqBody.topicId });
      if (!topic) {
        return badRequestResponse(res, {
          message: "Topic not found!",
        });
      }
      topic = cloneDeep(topic);
      var isCreated = await TOPICS.findOneAndUpdate(
        { _id: reqBody.topicId },
        {
          $set: {
            topicName: reqBody.topicName,
            topicMaterial: reqBody.topicMaterial,
            nextTopics: reqBody.nextTopics,
            prevTopics: reqBody.prevTopics,
            isActive: reqBody.isActive,
          },
        }
      );
      if (isCreated)
        return successResponse(res, {
          message: "Topic updated!",
        });
      else
        return badRequestResponse(res, {
          message: "Failed to update topic",
        });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  deleteTopics: async function (req, res) {
    try {
      const topicId = req.query.topicId;
      let isDeleted = await TOPICS.findOneAndRemove({
        _id: topicId,
      });
      if (isDeleted)
        return successResponse(res, {
          message: "Topic deleted!",
        });
      else
        return badRequestResponse(res, {
          message: "Failed to delete topic",
        });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
