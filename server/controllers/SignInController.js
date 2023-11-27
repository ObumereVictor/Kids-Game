const { StatusCodes } = require("http-status-codes");
const SignUpSchema = require("../models/SignUpModel");
const TempUserSchema = require("../models/TempUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signIn = async (request, response, next) => {
  let { email, password } = request.body;
  email = email.toLowerCase();

  if (!email || !password) {
    return response.status(StatusCodes.NOT_FOUND).json({
      status: "Failed",
      msg: "Please Input the fields",
      errorType: "noFields",
    });
  }
  const user = await SignUpSchema.findOne({ email });

  // IF USER IS NOT AVAILABLE
  if (!user) {
    return response.status(StatusCodes.NOT_FOUND).json({
      status: "Failed",
      msg: "Email doesn't exist, Please Sign Up",
      errorType: "invalidEmail",
    });
  }

  // IF PASSWORD DOESNT MATCH
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return response.status(StatusCodes.NOT_FOUND).json({
      status: "Failed",
      msg: "Invalid Password",
      errorType: "invalidPassword",
    });
  }

  const { _id, verified, completedProfile, role } = user;

  // CREATING TOKEN
  const token = jwt.sign({ _id, role }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  response.cookie("login_token", token, {
    HttpOnly: false,
    maxAge: 60 * 60 * 24,
    secure: true,
    sameSite: "none",
  });
  // IS USER VERIFIED
  const isUserVerified = await TempUserSchema.findOne({ userId: _id });
  if (isUserVerified) {
    // SEND VERIFICATION EMAIL
    return response.status(StatusCodes.OK).json({
      status: "Success",
      msg: "Please verify your account",
      responseType: "verifyAccount",
      userId: _id,
      email: user.email,
      verified,
    });
  }

  if (!completedProfile) {
    return response.status(StatusCodes.OK).json({
      status: "Success",
      msg: "Please complete your profile",
      responseType: "completeProfile",
      userId: _id,
      email: user.email,
      verified,
    });
  }

  response.status(StatusCodes.OK).json({
    status: "Success",
    msg: "Sucessfully logged in",
    responseType: "loggedIn",
  });

  next();
};

module.exports = { signIn };
