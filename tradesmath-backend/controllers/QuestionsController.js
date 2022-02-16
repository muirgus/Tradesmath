const mongoose = require("mongoose");
const { cloneDeep } = require("../lib/commonQuery");
const errorResponse = require("../middleware/error-response");
const {
  successResponse,
  badRequestResponse,
} = require("../middleware/response");
const QUESTIONS = mongoose.model("questions");
const TOPICS = mongoose.model("topics");
const USERS = mongoose.model("users");
const INVITATIONS = mongoose.model("invitations");
const ANSWERS = mongoose.model("answers");

exports.question = {
  migrateData: async function (req, res) {
    try {
      let allow = true;
      if (allow) {
        const questions = req.body.questions;
        const topics = req.body.topics;
        const users = req.body.users;
        const invitations = req.body.invitations;
        await TOPICS.insertMany(topics);
        await QUESTIONS.insertMany(questions);
        await users.map(async (topic) => {
          await USERS.create(topic);
        });
        await INVITATIONS.insertMany(invitations);
      }
      return successResponse(res, {
        message: "Done",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  lastAnswer: async function (req, res) {
    try {
      let lastAssessment = await ANSWERS.find({
        userId: req.user._id,
      })
        .sort({ _id: -1 })
        .limit(1);
      const userInfo = {};
      if (lastAssessment && lastAssessment[0]) {
        lastAssessment = cloneDeep(lastAssessment[0]);
        let isTopicExist = await TOPICS.findOne({
          _id: lastAssessment.topicId,
        });
        if (isTopicExist) {
          isTopicExist = cloneDeep(isTopicExist);
          userInfo["topicInfo"] = isTopicExist;
          if (isTopicExist.nextTopics && isTopicExist.nextTopics.length > 0) {
            userInfo["topic"] = isTopicExist.nextTopics[0];
          }
        }
      }
      if (!userInfo["topic"]) {
        let firstTopic = await TOPICS.find({
          $or: [
            {
              isActive: true,
            },
            {
              isActive: null,
            },
          ],
          topicName: "Place Value",
        })
          .sort({ topicName: 1 })
          .limit(1);
        if (firstTopic && firstTopic[0]) {
          userInfo["topic"] = cloneDeep(firstTopic[0])._id;
        }
      }
      return successResponse(res, userInfo);
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  transformMigrateData: async function (req, res) {
    try {
      let allow = true;
      if (allow) {
        const allTopics = cloneDeep(await TOPICS.find({}));
        const allQuestions = cloneDeep(await QUESTIONS.find({}));
        const allUsers = cloneDeep(await USERS.find({}));
        const allInvitations = cloneDeep(await INVITATIONS.find({}));
        await allTopics.map(async (topic) => {
          if (topic.nextTopics) {
            topic.nextTopics = allTopics
              .filter((x) => topic.nextTopics.includes(x.key))
              .map((x) => x._id);
          }
          if (topic.prevTopics) {
            topic.prevTopics = allTopics
              .filter((x) => topic.prevTopics.includes(x.key))
              .map((x) => x._id);
          }
          await TOPICS.findOneAndUpdate(
            { _id: topic._id },
            {
              $set: topic,
            }
          );
        });
        await allQuestions.map(async (topic) => {
          if (topic.topicId) {
            const topics = allTopics.find((x) => x.key == topic.topicId);
            if (topics) {
              topic.topicId = topics._id;
              await QUESTIONS.findOneAndUpdate(
                { _id: topic._id },
                {
                  $set: topic,
                }
              );
            }
          }
        });
        await allInvitations.map(async (topic) => {
          if (topic.invitationBy) {
            const topics = allUsers.find((x) => x.key == topic.invitationBy);
            if (topics) {
              topic.invitationBy = topics._id;
              await INVITATIONS.findOneAndUpdate(
                { _id: topic._id },
                {
                  $set: topic,
                }
              );
            }
          }
        });
      }
      return successResponse(res, {
        message: "Done",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getAllQuestions: async function (req, res) {
    try {
      const allQuestions = await QUESTIONS.find({});
      const questionsObj = cloneDeep(allQuestions);
      questionsObj.map((x) => delete x["__v"]);
      questionsObj.map(
        (x) =>
          (x.questionImage = x.questionImage
            ? `${this.getBaseUrl(req)}${x.questionImage}`
            : "")
      );
      let userIds = allQuestions
        .filter((x) => x.createdBy)
        .map((x) => x.createdBy);
      userIds = userIds.concat(
        allQuestions.filter((x) => x.updatedBy).map((x) => x.updatedBy)
      );
      userIds = Array.from(new Set(userIds));
      let usersInfo = await USERS.find({
        _id: {
          $in: userIds,
        },
      });
      usersInfo = cloneDeep(usersInfo);
      // eslint-disable-next-line array-callback-return
      questionsObj.map((x) => {
        const user = usersInfo.find((y) => y._id === x._id);
        if (user) {
          x.userName = user.email;
        }
      });
      return successResponse(res, {
        data: questionsObj,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getQuestionByTopic: async function (req, res) {
    try {
      const topicId = req.query.topicId;
      const allQuestions = await QUESTIONS.find({
        topicId: topicId,
      });
      const questionsObj = cloneDeep(allQuestions);
      questionsObj.map((x) => delete x["__v"]);
      questionsObj.map(
        (x) =>
          (x.questionImage = x.questionImage
            ? `${this.getBaseUrl(req)}${x.questionImage}`
            : "")
      );
      let userIds = questionsObj
        .filter((x) => x.createdBy)
        .map((x) => x.createdBy);
      userIds = userIds.concat(
        questionsObj.filter((x) => x.updatedBy).map((x) => x.updatedBy)
      );
      userIds = Array.from(new Set(userIds));
      let usersInfo = await USERS.find({
        _id: {
          $in: userIds,
        },
      });
      usersInfo = cloneDeep(usersInfo);
      // eslint-disable-next-line array-callback-return
      questionsObj.map((x) => {
        const user = usersInfo.find(
          (y) => y._id === x.createdBy || y._id === x.updatedBy
        );
        if (user) {
          x.userName = user.email;
        }
      });
      const payload = {};
      payload["questions"] = questionsObj;
      const topic = await TOPICS.findOne({
        _id: topicId,
      });
      if (topic) {
        payload["topic"] = cloneDeep(topic);
      }
      return successResponse(res, {
        data: payload,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getBaseUrl: function (req) {
    return `${req.protocol}://${req.get("host")}/uploads/`;
  },
  getQuestionById: async function (req, res) {
    try {
      const questionId = req.query.questionId;
      const allQuestions = await QUESTIONS.findOne({
        _id: questionId,
      });
      if (!allQuestions) {
        return badRequestResponse(res, {
          message: "No question found",
        });
      }
      const questionsObj = cloneDeep(allQuestions);
      if (questionsObj.questionImage)
        questionsObj.questionImage = `${this.getBaseUrl(req)}${
          questionsObj.questionImage
        }`;
      return successResponse(res, {
        data: questionsObj,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getUploadedFile: function (req) {
    let pathDirectory = __dirname.split("\\");
    pathDirectory.pop();
    pathDirectory = pathDirectory.join("\\");
    const uploadedFile = req.files.uploadImage;
    const extension =
      uploadedFile.name.split(".")[uploadedFile.name.split(".").length - 1];
    const fileName = `${new Date().valueOf()}_${Math.ceil(
      Math.random() * 10000
    )}.${extension}`;
    const uploadFilePath = `${pathDirectory}/uploads/${fileName}`;
    return {
      fileName,
      uploadFilePath,
      uploadedFile,
    };
  },
  createQuestions: async function (req, res) {
    try {
      const reqBody = req.body;
      const questionObj = {
        questionText: reqBody.questionText,
        equation: reqBody.equation,
        min1: reqBody.min1,
        max1: reqBody.max1,
        step1: reqBody.step1,
        min2: reqBody.min2,
        max2: reqBody.max2,
        step2: reqBody.step2,
        topicId: reqBody.topicId,
        imageLink: reqBody.imageLink,
        videoLink: reqBody.videoLink,
        createdBy: req.user._id,
        referenceMaterial: reqBody.referenceMaterial,
      };
      if (req.files && Object.keys(req.files).length > 0) {
        const fileInfo = this.getUploadedFile(req);
        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath, async function (err) {
          if (err)
            return badRequestResponse(res, {
              message: "Failed to save file",
              extra: JSON.stringify(err),
            });
          questionObj.questionImage = fileInfo.fileName;
          const isCreated = await QUESTIONS.create(questionObj);
          if (isCreated)
            return successResponse(res, {
              message: "Question created!",
            });
          else
            return badRequestResponse(res, {
              message: "Failed to create question",
            });
        });
      } else {
        const isCreated = await QUESTIONS.create(questionObj);
        if (isCreated)
          return successResponse(res, {
            message: "Question created!",
          });
        else
          return badRequestResponse(res, {
            message: "Failed to create question",
          });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  updateQuestions: async function (req, res) {
    try {
      const reqBody = req.body;
      let question = await QUESTIONS.findOne({ _id: reqBody.questionId });
      if (!question) {
        return badRequestResponse(res, {
          message: "Question not found!",
        });
      }
      question = cloneDeep(question);
      const updateQuestionInfo = {
        questionText: reqBody.questionText,
        equation: reqBody.equation,
        min1: reqBody.min1,
        max1: reqBody.max1,
        step1: reqBody.step1,
        min2: reqBody.min2,
        max2: reqBody.max2,
        step2: reqBody.step2,
        topicId: reqBody.topicId,
        imageLink: reqBody.imageLink,
        videoLink: reqBody.videoLink,
        referenceMaterial: reqBody.referenceMaterial,
        updatedBy: req.user._id,
      };
      if (req.files && Object.keys(req.files).length > 0) {
        const fileInfo = this.getUploadedFile(req);
        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath, async function (err) {
          if (err)
            return badRequestResponse(res, {
              message: "Failed to save file",
              extra: JSON.stringify(err),
            });
          updateQuestionInfo.questionImage = fileInfo.fileName;
          const isCreated = await QUESTIONS.findOneAndUpdate(
            { _id: reqBody.questionId },
            {
              $set: updateQuestionInfo,
            }
          );
          if (isCreated)
            return successResponse(res, {
              message: "Question updated!",
            });
          else
            return badRequestResponse(res, {
              message: "Failed to update question",
            });
        });
      } else {
        const isCreated = await QUESTIONS.findOneAndUpdate(
          { _id: reqBody.questionId },
          {
            $set: updateQuestionInfo,
          }
        );
        if (isCreated)
          return successResponse(res, {
            message: "Question updated!",
          });
        else
          return badRequestResponse(res, {
            message: "Failed to update question",
          });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  deleteQuestions: async function (req, res) {
    try {
      const questionId = req.query.questionId;
      let isDeleted = await QUESTIONS.findOneAndRemove({
        _id: questionId,
      });
      if (isDeleted)
        return successResponse(res, {
          message: "Question deleted!",
        });
      else
        return badRequestResponse(res, {
          message: "Failed to delete question",
        });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
