"use strict";
var mongoose = require("mongoose");

var InvitationSchema = new mongoose.Schema(
  {
    invitationId: {
      type: String,
      trim: true,
    },
    invitationBy: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    isValid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

InvitationSchema.index({ invitationId: 1 });

var invitations = mongoose.model("invitations", InvitationSchema);
module.exports = invitations;
