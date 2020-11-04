const Session = require("../model/session.model");
const Application = require("../model/application.model");
const UiProfile = require("../model/uiProfile.model");

module.exports.createSession = async function (request) {
  try {
    const application = await Application.findOne({
      _id: request.body.applicationId,
      secret: request.body.secret,
    });
    const uiProfile = await UiProfile.findOne({
      _id: request.body.uiProfileId,
    });
    if (uiProfile.applicationId.toString() == application._id.toString()) {
      const session = new Session({
        numActiveConnections: 0,
        applicationId: application._id,
        uiProfileId: uiProfile._id,
      });
      const savedSession = await session.save();
      return {
        success: true,
        status: 201,
        message: "Session Created Successfully",
        data: savedSession,
      };
    } else {
      return {
        success: true,
        status: 500,
        message: "Unable to find application/UI profile",
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};

module.exports.getSession = async function (request) {
  try {
    const session = await Session.findOne({ _id: request.params.id });
    const uiProfile = await UiProfile.findOne({ _id: session.uiProfileId });

    return {
      success: true,
      status: 200,
      data: Object.assign(session, uiProfile),
      message: "Session fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};

module.exports.connectSession = async function (request) {
  try {
    const session = await Session.findOne({ _id: request.params.id });
    const currentNumConnections = session["numActiveConnections"] + 1;
    await Session.updateOne(
      { _id: session._id },
      { $set: { numActiveConnections: currentNumConnections } },
      { new: true }
    );

    //Todo  Pusblish Connected to Redis

    const updatedSession = await Session.findOne({ _id: session._id });
    const uiProfile = await UiProfile.findOne({ _id: session.uiProfileId });
    return {
      success: true,
      status: 200,
      data: { session: updatedSession, uiProfile: uiProfile },
      message: "Session connected successfully",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};

module.exports.disconnectSession = async function (request) {
  try {
    const session = await Session.findOne({ _id: request.params.id });
    const currentNumConnections =
      session["numActiveConnections"] == 0
        ? 0
        : session["numActiveConnections"] - 1;
    await Session.updateOne(
      { _id: session._id },
      { $set: { numActiveConnections: currentNumConnections } },
      { new: true }
    );

    //Todo  Pusblish Disonnect to Redis

    const updatedSession = await Session.findOne({ _id: session._id });
    const uiProfile = await UiProfile.findOne({ _id: session.uiProfileId });
    return {
      success: true,
      status: 200,
      data: { session: updatedSession, uiProfile: uiProfile },
      message: "Session disconnected successfully",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};
