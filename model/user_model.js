const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const User = mongoose.model("User", UserSchema);
User.prototype.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
    { ID: user._id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return verificationToken;
};
module.exports = User;
