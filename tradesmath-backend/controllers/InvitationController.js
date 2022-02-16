const mongoose = require("mongoose");
const { cloneDeep } = require("../lib/commonQuery");
const nodemailer = require("nodemailer");
const errorResponse = require("../middleware/error-response");
const {
  successResponse,
  badRequestResponse,
} = require("../middleware/response");
const INVITATION = mongoose.model("invitations");

exports.invitation = {
  getAllInvitations: async function (req, res) {
    try {
      const allInvitations = await INVITATION.find({});
      const invitationsObj = cloneDeep(allInvitations);
      invitationsObj.map((x) => delete x["__v"]);
      return successResponse(res, {
        data: invitationsObj,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getInvitationById: async function (req, res) {
    try {
      const invitationId = req.query.invitationId;
      const invitation = await INVITATION.findOne({
        invitationId: invitationId,
      });
      if (!invitation) {
        return badRequestResponse(res, {
          message: "No invitation found",
        });
      }
      const invitationObj = cloneDeep(invitation);
      delete invitationObj["__v"];
      return successResponse(res, {
        data: invitationObj,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  createInvitation: async function (req, res) {
    try {
      const reqBody = req.body;
      const invitation = {
        invitationId: reqBody.invitationId,
        email: reqBody.email,
        name: reqBody.name,
        invitationBy: req.user._id,
        isValid: true,
      };
      const invitationText = `Hello ${reqBody.name}, <br /><br />

      ${req.user.firstName} ${req.user.lastName} has invited you to become the administrator of the Trades Math app.<br /> Please click on the link below to register:
      <a href="${reqBody.invitationLink}">link</a>
      <br />
      <br />
      <br />
      Thank you,
      <br />
      Trades Math App`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.gmailUserName,
          pass: process.env.gmailPassword,
        },
      });

      const emailSended = await transporter.sendMail({
        from: "Trades Math",
        to: req.body.email,
        subject: "Trades Math - Practice App",
        text: "Invitation to Collaborate",
        html: invitationText,
      });

      if (emailSended.accepted) {
        var isCreated = await INVITATION.create(invitation);
        if (isCreated)
          return successResponse(res, {
            message: "Invitation sent successfully",
          });
        else
          return badRequestResponse(res, {
            message: "Failed to create invitation",
          });
      } else {
        return badRequestResponse(res, {
          message: "Failed to create invitation",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  updateInvitation: async function (req, res) {
    try {
      const reqBody = req.body;
      let invitation = await INVITATION.findOne({
        invitationId: reqBody.invitationId,
      });
      if (!invitation) {
        return badRequestResponse(res, {
          message: "Invitation not found!",
        });
      }
      invitation = cloneDeep(invitation);
      var isCreated = await INVITATION.findOneAndUpdate(
        { invitationId: reqBody.invitationId },
        {
          $set: {
            isValid: false,
          },
        }
      );
      if (isCreated)
        return successResponse(res, {
          message: "Invitation updated!",
        });
      else
        return badRequestResponse(res, {
          message: "Failed to update invitation",
        });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
