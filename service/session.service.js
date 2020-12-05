const Session = require("../model/session.model");
const Application = require("../model/application.model");
const UiProfile = require("../model/uiProfile.model");
const redis = require("redis");
const redisClient = redis.createClient();

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
      const profile = {};
      uiProfile.profile.forEach((element) => {
        // let uiElement = {
        //   name: element.name,
        //   value: element.default,
        // };
        profile[element.name] = element.default;
      });
      const session = new Session({
        numActiveConnections: 0,
        applicationId: application._id,
        uiProfileId: uiProfile._id,
        profile: profile,
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
      data: {
        session: session,
        uiProfile: uiProfile,
      },
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
    redisClient.publish(
      session._id.toString(),
      "CONNECTED::" + currentNumConnections,
      () => {
        console.log("CONNECTED on " + session._id);
      }
    );

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
    redisClient.publish(
      session._id.toString(),
      "DISCONNECTED::" + currentNumConnections,
      () => {
        console.log("DISCONNECTED on " + session._id);
      }
    );

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

module.exports.publishAction = async function (request) {
  try {
    const session = await Session.findOne({ _id: request.params.id });
    if (session.isActive) {
      redisClient.publish(session._id.toString(), request.body.action, () => {
        // console.log(request.body.action);
      });
      const key = "profile." + request.body.action.split("::")[1];
      const value = request.body.action.split("::")[2];
      const update = {};
      update[key] = value;
      await Session.updateOne(
        { _id: session._id },
        { $set: update },
        { new: true }
      );
    } else {
      return {
        success: false,
        status: 200,
        message: "No Active session found. Unable to publish action",
      };
    }
    const updatedSession = await Session.findOne({ _id: request.params.id });
    return {
      success: true,
      status: 200,
      message: "Action Published successfully",
      data: {
        session: updatedSession,
      },
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error,
    };
  }
};
