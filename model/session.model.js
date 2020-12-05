const mongoose = require("mongoose");
const sessionSchema = mongoose.Schema(
  {
    numActiveConnections: { type: Number },
    applicationId: { type: mongoose.Types.ObjectId, ref: "applications" },
    uiProfileId: { type: mongoose.Types.ObjectId, ref: "uiprofiles" },
    isActive: { type: Boolean, default: true },
    profile: {},
  },
  {
    timestamps: true,
  }
);

const Session = (module.exports = mongoose.model("session", sessionSchema));
