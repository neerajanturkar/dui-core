const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;
const userSchema = mongoose.Schema(
  {
    id: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    type: { type: String, enum: ["user", "admin"], require: true },
    password: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  let user = this;

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err)
      // eslint-disable-next-line no-console
      console.log(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err)
        // eslint-disable-next-line no-console
        console.log(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};
const User = (module.exports = mongoose.model("user", userSchema));
