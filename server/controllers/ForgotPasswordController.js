const { StatusCodes } = require("http-status-codes");
const SignUpSchema = require("../models/SignUpModel");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS);

const sendResetPasswordEmail = async (request, response) => {
  const { email } = request.body;

  // NO INPUT
  if (!email) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Input your email address",
      errorType: "noInputError",
    });
  }

  // CHECKING IF USER EXIST
  const user = await SignUpSchema.findOne({ email });
  if (!user) {
    return response
      .status(StatusCodes.OK)
      .json({ status: "Success", msg: "Email Sent Successfully" });
  }
  const { _id } = user;
  await sendResetPasswordLink({ _id, email }, response);

  return response
    .status(StatusCodes.OK)
    .json({ status: "Success", msg: "Email Sent Successfully" });
};
// SENDING RESET PASSWORD LINK
const sendResetPasswordLink = async ({ _id, email }, response) => {
  const currentURL = "http://localhost:3000";
  let data = { email, _id };
  let token = jwt.sign(data, process.env.JWT_KEY, { expiresIn: 60 * 10 });
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EEMAIL,
      pass: process.env.EPASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.envEEMAIL,
    to: email,
    subject: "Reset your password for your account",
    html: `<div> <h2>Password Reset</h2>

    <p>Click the link to reset your password 
    <a href=${currentURL + "/reset-password/" + token} target= _blank>Link</a>
    <p>Link expires in 10 minutes</p>
    If you didn't initiate password reset for your account. </p>
    </div>`,
  };
  transporter.sendMail(mailOptions);
};

//    VERIFY PASSWORD LINK
const verifyResetPasswordLink = async (request, response) => {
  response.redirect("http://localhost:3000/reset-password/:token");
};

//     UPDATE PASSWORD
const updatePassword = async (request, response) => {
  const { newPassword, confirmPassword } = request.body;

  const { token } = request.params;

  // NO FIELDS
  if (!newPassword || !confirmPassword) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Enter the required fields",
      errorType: "nofields",
    });
  }

  // PASSWORDS DOESNT MATCH
  if (newPassword !== confirmPassword) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Password doesn't match",
      errorType: "notmatch",
    });
  }

  // COMPARE TOKEN
  try {
    const isTokenOk = jwt.verify(token, process.env.JWT_KEY);
    const { _id, email } = isTokenOk;
    const hashedUpdatedPassword = await bcrypt.hash(newPassword, saltRounds);
    const user = await SignUpSchema.findOneAndUpdate(
      { _id },
      { password: hashedUpdatedPassword }
    );
    await user.save();
    console.log(user);
    return response
      .status(StatusCodes.CREATED)
      .json({ status: "Success", msg: "Password Changed!" });
  } catch (error) {
    console.log(error);

    // EXPIRED JWT
    if (error.message === "jwt expired") {
      return response.status(StatusCodes.NOT_ACCEPTABLE).json({
        status: "Failed",
        msg: "Reset password link has expired",
        errorType: "linkexpired",
      });
    }

    // CHECKING MONGOOSE PASSWORD ERROR
    if (error.errors.password) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        msg: `Password ${error.errors.password.properties.message}`,
        errorType: "mongooseError",
      });
    }
  }

  response.end();
};

module.exports = {
  sendResetPasswordEmail,
  verifyResetPasswordLink,
  updatePassword,
};
