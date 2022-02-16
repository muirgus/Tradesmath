"use strict";
var mongoose = require("mongoose");

var AnswerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
    },
    questions: {
      type: Array,
      trim: [],
    },
    score: {
      type: String,
    },
    topicId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

AnswerSchema.index({ userId: 1 });

var answers = mongoose.model("answers", AnswerSchema);
module.exports = answers;
