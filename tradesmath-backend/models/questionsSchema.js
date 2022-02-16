"use strict";
var mongoose = require("mongoose");

var QuestionsSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      default: "",
      trim: true,
    },
    equation: {
      type: String,
      default: "",
      trim: true,
    },
    min1: {
      type: String,
      default: "",
      trim: true,
    },
    max1: {
      type: String,
      default: "",
      trim: true,
    },
    step1: {
      type: String,
      default: "",
      trim: true,
    },
    min2: {
      type: String,
      default: "",
      trim: true,
    },
    max2: {
      type: String,
      default: "",
      trim: true,
    },
    step2: {
      type: String,
      default: "",
      trim: true,
    },
    topicId: {
      type: String,
      default: "",
      trim: true,
    },
    imageLink: {
      type: String,
      default: "",
      trim: true,
    },
    videoLink: {
      type: String,
      default: "",
      trim: true,
    },
    createdBy: {
      type: String,
      default: "",
      trim: true,
    },
    updatedBy: {
      type: String,
      default: "",
      trim: true,
    },
    key: {
      type: String,
      default: "",
      trim: true,
    },
    questionImage: {
      type: String,
      default: "",
    },
    referenceMaterial: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

var questions = mongoose.model("questions", QuestionsSchema);
module.exports = questions;
