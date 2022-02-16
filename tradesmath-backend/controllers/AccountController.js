const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const errorResponse = require("../middleware/error-response");
const nodemailer = require("nodemailer");
const {
  badRequestResponse,
  successResponse,
  notFoundResponse,
} = require("../middleware/response");
const { decodeUris, cloneDeep, getHost } = require("../lib/commonQuery");
const USER = mongoose.model("users");
const ANSWERS = mongoose.model("answers");
const TOPICS = mongoose.model("topics");

exports.account = {
  getBaseUrl: function (req) {
    return `${req.protocol}://${req.get("host")}/uploads/`;
  },
  login: async function (req, res) {
    try {
      req.body = decodeUris(req.body);
      let userInfo = await USER.findOne({
        email: req.body.email,
      });
      if (userInfo) {
        if (!bcrypt.compareSync(req.body.password, userInfo.password)) {
          return badRequestResponse(res, {
            message: "Authentication failed. Wrong password.",
          });
        }
        if (!userInfo.isActive) {
          return badRequestResponse(res, {
            message:
              "Your account is deactivated, please activate your account from here",
            accountDeactive: true,
          });
        }
        userInfo = cloneDeep(userInfo);
        if (userInfo.profileImage)
          userInfo.profileImage = `${this.getBaseUrl(req)}${
            userInfo.profileImage
          }`;
        delete userInfo["password"];
        // create a token
        var token = jwt.sign(userInfo, process.env.secret, {
          expiresIn: "24h", // expires in 24 hours
        });
        const returnDTO = {
          message: "You are logged in successfully!",
          token,
          userInfo,
        };
        let lastAssessment = await ANSWERS.find({
          userId: userInfo._id,
        })
          .sort({ _id: -1 })
          .limit(1);
        if (lastAssessment && lastAssessment[0]) {
          lastAssessment = cloneDeep(lastAssessment[0]);
          let isTopicExist = await TOPICS.findOne({
            _id: lastAssessment.topicId,
          });
          if (isTopicExist) {
            isTopicExist = cloneDeep(isTopicExist);
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
        return successResponse(res, returnDTO);
      }
      return notFoundResponse(res, {
        message: "Email not found!",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  register: async function (req, res) {
    try {
      const userInfo = await USER.findOne({
        email: req.body.email,
      });
      if (userInfo) {
        return badRequestResponse(res, {
          message: "Email already exist!",
        });
      }
      if (req.body.password !== req.body.confirmPassword) {
        return badRequestResponse(res, {
          message: "Password and Confirm Password must be same",
        });
      }
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
        isActive: false,
        isSuperAdmin: req.body.isSuperAdmin,
        invitedBy: req.body.invitedBy,
      };
      const otpCode = this.getOtpCode();

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
        text: "Please activate your account in order to use the Trades Math - Practice App",
        html: `Thank you signup with Trades Math - Practice App. <br />Your account activation code is: ${otpCode}.`,
      });

      if (emailSended.accepted) {
        user.accountActivationCode = otpCode;
        var isCreated = await USER.create(user);
        if (isCreated)
          return successResponse(res, {
            message: "User created!",
          });
        else
          return badRequestResponse(res, {
            message: "Failed to create user",
          });
      } else {
        return badRequestResponse(res, {
          message: "Failed to send account activation code",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  forgetPassword: async function (req, res) {
    try {
      const userInfo = await USER.findOne({
        email: req.body.email,
      });
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found!",
        });
      }
      const otpCode = this.getOtpCode();

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
        subject: "Forgot password",
        text: "We have received your forgot password request",
        html: `Code: ${otpCode} <br />Otp code will be expired in 10 minutes. Please click on the link below to register:
        <a href="${req.body.invitationLink}">link</a>
        <br />
        <br />
        <br />
        Thank you,
        <br />
        Trades Math App`,
      });
      if (emailSended.accepted) {
        await USER.findOneAndUpdate(
          { _id: userInfo._id },
          {
            $set: {
              forgetPasswordOtp: otpCode,
              forgetPasswordOtpExpireTime: this.getOtpExpireTime(),
            },
          }
        );
        return successResponse(res, {
          message:
            "Forget password otp code send, please check your email account.",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to send otp code",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  verifyOtpCode: async function (req, res) {
    try {
      const userInfo = await USER.findOne({
        email: req.body.email,
      });
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found",
        });
      }
      if (!userInfo.forgetPasswordOtp) {
        return badRequestResponse(res, {
          message: "Please send the request for forgot password first",
        });
      }
      if (new Date(userInfo.forgetPasswordOtpExpireTime) < new Date()) {
        return badRequestResponse(res, {
          message: "Otp code has expired, please send the code again",
        });
      }
      if (userInfo.forgetPasswordOtp !== req.body.otpCode) {
        return badRequestResponse(res, {
          message: "Otp code is invalid",
        });
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return badRequestResponse(res, {
          message: "Passwords should match",
        });
      }
      userInfo.password = req.body.newPassword;
      await USER.findOneAndUpdate(
        { _id: userInfo._id },
        {
          $set: {
            password: userInfo.password,
            forgetPasswordOtp: null,
            forgetPasswordOtpExpireTime: null,
          },
        }
      );
      return successResponse(res, {
        message: "Password reset successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  changePassword: async function (req, res) {
    try {
      const userInfo = await USER.findOne({
        email: req.body.email,
      });
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found",
        });
      }
      if (!bcrypt.compareSync(req.body.oldPassword, userInfo.password)) {
        return badRequestResponse(res, {
          message: "Old password should be same as new password",
        });
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return badRequestResponse(res, {
          message: "Passwords should match",
        });
      }
      userInfo.password = req.body.newPassword;
      var isUpdated = await USER.findOneAndUpdate(
        { _id: userInfo._id },
        {
          $set: {
            password: userInfo.password,
          },
        }
      );
      if (isUpdated) {
        return successResponse(res, {
          message: "Password changed successfully",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to update password",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  activateAccount: async function (req, res) {
    try {
      let userInfo = await USER.findOne({
        email: req.body.email,
      });
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found!",
        });
      }
      userInfo = cloneDeep(userInfo);
      if (userInfo.accountActivationCode == req.body.accountActivationCode) {
        const isUpdated = await USER.findOneAndUpdate(
          { _id: userInfo._id },
          {
            $set: {
              isActive: true,
            },
          }
        );
        if (isUpdated) {
          return successResponse(res, {
            message: "Account activated successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to activate account",
          });
        }
      } else {
        return badRequestResponse(res, {
          message: "Please enter correct activation code",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  updateProfile: async function (req, res) {
    try {
      let userInfo = await USER.findOne({
        email: req.body.email,
      });
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found!",
        });
      }
      userInfo = cloneDeep(userInfo);
      userInfo.firstName = req.body.firstName;
      userInfo.lastName = req.body.lastName;
      if (req.body.isAdmin != undefined) userInfo.isAdmin = req.body.isAdmin;
      if (req.body.isSuperAdmin != undefined)
        userInfo.isSuperAdmin = req.body.isSuperAdmin;
      if (req.body.isActive != undefined) userInfo.isActive = req.body.isActive;
      const updatePayload = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        isAdmin: userInfo.isAdmin,
        isSuperAdmin: userInfo.isSuperAdmin,
        isActive: userInfo.isActive,
      };
      if (req.body.profileImage) {
        const base64Data = req.body.profileImage.replace(
          /^data:image\/png;base64,/,
          ""
        );
        let pathDirectory = __dirname.split("\\");
        pathDirectory.pop();
        pathDirectory = pathDirectory.join("\\");
        const fileName = `${new Date().valueOf()}.png`;
        const uploadFilePath = `${pathDirectory}/uploads/${fileName}`;
        updatePayload.profileImage = fileName;
        require("fs").writeFile(
          uploadFilePath,
          base64Data,
          "base64",
          function (err) {
            console.log(err);
          }
        );
      }
      var isUpdated = await USER.findOneAndUpdate(
        { _id: userInfo._id },
        {
          $set: updatePayload,
        }
      );
      if (isUpdated) {
        return successResponse(res, {
          message: "Profile updated successfully",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to update profile",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getAllUsers: async function (req, res) {
    try {
      let userInfo = await USER.findOne({
        email: req.user.email,
      });
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found!",
        });
      }
      const users = cloneDeep(await USER.find({}));
      users.map((x) => delete x["password"]);
      return successResponse(res, {
        data: users,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getUserById: async function (req, res) {
    try {
      let userInfo = await USER.findOne({
        _id: req.query.userId,
      });
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found!",
        });
      }
      const users = cloneDeep(userInfo);
      if (users.profileImage) {
        users.profileImage = `${getHost(req)}/uploads/${users.profileImage}`;
      }
      delete users["password"];
      return successResponse(res, {
        data: users,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  deleteUsers: async function (req, res) {
    try {
      const userId = req.query.userId;
      let isDeleted = await USER.findOneAndRemove({
        _id: userId,
      });
      if (isDeleted)
        return successResponse(res, {
          message: "User deleted!",
        });
      else
        return badRequestResponse(res, {
          message: "Failed to delete user",
        });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getOtpCode: function () {
    return parseFloat(
      `${Math.ceil(Math.random() * 5 * 100000)}`.padEnd(6, "0")
    );
  },
  getOtpExpireTime: function () {
    return new Date(new Date().getTime() + 10 * 60000);
  },
};
