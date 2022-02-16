const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/AnalyticsController");

router.post("/save-analytics", function (req, res) {
  return analyticsController.analytics.saveQuestions(req, res);
});

router.get("/get", function (req, res) {
  return analyticsController.analytics.getCounts(req, res);
});

router.get("/top-wrong-answers", function (req, res) {
  return analyticsController.analytics.getTopWrongAnswers(req, res);
});

router.post("/get-question-analytics", function (req, res) {
  return analyticsController.analytics.getQuestionsBetween(req, res);
});

module.exports = router;
