"use strict";
var mongoose = require("mongoose");

var AnalysisSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      trim: true,
    },
    wrongAnswerCount: {
      type: Number,
      default: 0,
    },
    questionTemplateText: {
      type: String,
      trim: true,
    },
    topicId: {
      type: String,
      trim: true,
    },
    users: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

AnalysisSchema.index({ questionId: 1, topicId: 1 });

var analysis = mongoose.model("analysis", AnalysisSchema);
module.exports = analysis;
