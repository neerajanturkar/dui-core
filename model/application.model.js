const mongoose = require("mongoose");
const applicationSchema = mongoose.Schema(
  {
    secret: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);

const Application = (module.exports = mongoose.model(
  "application",
  applicationSchema
));
