const express = require("express");
const router = express.Router();

const questionController = require("../controllers/QuestionsController");

router.post("/create", function (req, res) {
  return questionController.question.createQuestions(req, res);
});

router.get("/get", function (req, res) {
  return questionController.question.getAllQuestions(req, res);
});

router.get("/get-questions-by-id", function (req, res) {
  return questionController.question.getQuestionByTopic(req, res);
});

router.get("/last-question", function (req, res) {
  return questionController.question.lastAnswer(req, res);
});

router.get("/get-questions", function (req, res) {
  return questionController.question.getQuestionById(req, res);
});

router.post("/update", function (req, res) {
  return questionController.question.updateQuestions(req, res);
});

router.post("/migrate", function (req, res) {
  return questionController.question.migrateData(req, res);
});

router.post("/transform-migrate", function (req, res) {
  return questionController.question.transformMigrateData(req, res);
});

router.delete("/delete", function (req, res) {
  return questionController.question.deleteQuestions(req, res);
});

module.exports = router;
