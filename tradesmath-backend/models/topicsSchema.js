"use strict";
var mongoose = require("mongoose");

var TopicsSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      default: "",
      trim: true,
    },
    topicMaterial: {
      type: String,
      default: "",
      trim: true,
    },
    nextTopics: {
      type: Array,
      default: [],
    },
    prevTopics: {
      type: Array,
      default: [],
    },
    createdBy: {
      type: String,
      default: "",
    },
    key: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

var card = mongoose.model("topics", TopicsSchema);
module.exports = card;
