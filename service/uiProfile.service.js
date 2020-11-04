const libCommon = require("../lib/common");
const jwt = require("jsonwebtoken");
const Application = require("../model/application.model");
const UiProfile = require("../model/uiProfile.model");

module.exports.createUiProfile = async function (request) {
  try {
    const jwtVerifiedData = jwt.verify(request.token, "secretKey");

    request.body["userId"] = jwtVerifiedData.id;
    let newUiProfile = new UiProfile(request.body);
    const savedUiProfile = await newUiProfile.save();
    return {
      success: true,
      status: 201,
      message: "UI Profile created successfully",
      data: savedUiProfile,
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
