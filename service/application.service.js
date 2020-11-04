const libCommon = require("../lib/common");
const jwt = require("jsonwebtoken");
const Application = require("../model/application.model");
const UiProfile = require("../model/uiProfile.model");

module.exports.createApplication = async function (request) {
  try {
    const jwtVerifiedData = jwt.verify(request.token, "secretKey");

    request.body["userId"] = jwtVerifiedData.id;
    let newApplication = new Application(request.body);
    const savedApplication = await newApplication.save();
    return {
      success: true,
      status: 201,
      message: "Application created successfully",
      data: savedApplication,
    };
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return {
        success: false,
        status: 403,
        message: error,
      };
    }
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};

module.exports.getApplication = async function (request) {
  try {
    const jwtVerifiedData = jwt.verify(request.token, "secretKey");
    const application = await Application.findOne({ _id: request.params.id });
    if (application.userId == jwtVerifiedData.id) {
      const uiProfiles = await UiProfile.find({
        applicationId: application._id,
      });
      return {
        success: true,
        status: 200,
        message: "Application fetched successfully",
        data: {
          application: application,
          uiProfiles: uiProfiles,
        },
      };
    } else {
      return {
        success: false,
        status: 403,
        message: "User not authorized",
      };
    }
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return {
        success: false,
        status: 403,
        message: error,
      };
    }
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};
