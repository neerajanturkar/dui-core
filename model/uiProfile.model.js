const mongoose = require("mongoose");
const uiProfileSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    url: { type: String, require: true },
    default: { type: Boolean },
    applicationId: { type: mongoose.Types.ObjectId, ref: "applications" },
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    type: { type: String, enum: ["mobile", "web"] },
    profile: [],
  },
  {
    timestamps: true,
  }
);

const UiProfile = (module.exports = mongoose.model(
  "uiProfile",
  uiProfileSchema
));
