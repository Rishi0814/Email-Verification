const mongoose = require("mongoose");
const User = require("../model/user_model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const { use } = require("../routes/routes");
// const User = require("../model/user_model");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.signup = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(422).send({ message: "Missing Email" });
  }
  try {
    const existinguser = await User.findOne({ email: email }).exec();
    if (existinguser) {
      res.status(409).send({ message: "Email already in use!" });
    }

    const user = await User.create({
      _id: new mongoose.Types.ObjectId(),
      email: email,
    });

    const verificationToken = user.generateVerificationToken();
    // console.log(verificationToken);
    const url = `https://email-verification-bxfu.onrender.com/verify/${verificationToken}`;
    // console.log(url);

    transporter.sendMail({
      to: email,
      subject: "Verify Account",
      html: `click <a href="${url}">here</a> to confirm your Email`,
    });
    res.status(201).send({
      message: `Sent a verification Mail to ${email}`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  if (!email) {
    res.status(422).send({ message: "Missing Email" });
  }
  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return res.status(404).send("Email does'nt exist!");
    }
    if (!user.verified) {
      return res.status(403).send("Verify Your Email");
    }
    return res.status(200).send("User Logged In");
  } catch (err) {
    console.log(err);
  }
};

exports.verify = async (req, res) => {
  // const token1 = req.params;
  // console.log(req.params);
  // console.log(token1);
  const token1 = JSON.stringify(req.params);
  const token = token1.slice(7, -2);
  // const token = req.params.token;
  console.log(token);
  if (!token) {
    res.status(422).send("Missing Token");
  }
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
  }
  try {
    const user = await User.findOne({ _id: payload.ID }).exec();
    // console.log(user);
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    user.verified = true;
    // console.log(user);
    await user.save();
    return res.status(200).send("Email Verified");
  } catch (error) {
    console.log(error);
  }
};
