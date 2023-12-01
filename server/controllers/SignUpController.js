const { StatusCodes } = require("http-status-codes");
const SignUpSchema = require("../models/SignUpModel");
const TempUserSchema = require("../models/TempUserModel");
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const nodemailer = require("nodemailer");

const register = async (request, response) => {
  let {
    firstname,
    lastname,
    email,
    age,
    password,
    repassword,
    username,
    readterms,
  } = request.body;

  email = email.toLowerCase();

  // NO INPUT FOUND
  if (
    !firstname ||
    !lastname ||
    !email ||
    !age ||
    !password ||
    !repassword ||
    !username
  ) {
    return response
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ status: "Failed", msg: "No Fields", errorType: "nofields" });
  }
  // CHECKING FOR AGE
  if (age < 1) {
    return response
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ status: "Failed", msg: "Invalid age", errorType: "invalidage" });
  }

  // CHECKING PASSWORDS INPUT
  if (password !== repassword) {
    return response
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ status: "failed", msg: "Not match", errorType: "notmatch" });
  }
  // IF THEY DONT AGREE MY TERMS
  if (!readterms) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Agree to the terms and condition",
      errorType: "termserror",
    });
  }

  // SETTING ROLE
  const isFirstCount = (await SignUpSchema.countDocuments({})) === 0;
  const role = isFirstCount ? "admin" : "user";

  // CHECKING IF EMAIL IS A DUPLICATE

  const isEmailAvaliable = await SignUpSchema.findOne({ email });
  if (isEmailAvaliable) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Email avaliable",
      errorType: "emailexist",
    });
  }

  // CHECKING IF USERNAME IS A DUPLICATE
  const isUserNameAvaliable = await SignUpSchema.findOne({ username });
  if (isUserNameAvaliable) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Username Avaliable",
      errorType: "usernameexist",
    });
  }
  // HASHING PASSWORD

  let hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  try {
    const newUser = await SignUpSchema.create({
      ...request.body,
      role,
      password: hashedPassword,
    });
    // console.log(newUser);
    const { _id, email, verified } = newUser;

    // CREATING TEMP USER

    // HASHING THE UNIQUE STRING
    let uniqueString = uuidv4() + _id;
    sendVerificationMail({ _id, email }, uniqueString, response);
    const saltRounds = Number(process.env.SALT_ROUNDS);
    bcrypt.hash(uniqueString, saltRounds).then(async (hashedString) => {
      // CREATING NEW TEMP USER
      const tempUser = await TempUserSchema.create({
        userId: _id,
        uuid: hashedString,
        uniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000,
      });
    });
    return response.status(201).json({
      status: "Success",
      msg: "Registered",
      userId: _id,
      verified,
      email,
    });
  } catch (error) {
    console.log(error);
    // HANDLING MONGOOSE ERROR
    if (
      error.errors.firstname.kind === "regexp" ||
      error.errors.lastname.kind === "regexp"
    ) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        msg: `First Name or Last name should contain only letters`,

        errorType: "firstnameError",
      });
    }
    if (error.errors.firstname) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        msg: `First Name ${error.errors.firstname.message} letters`,
        errorType: "firstnameError",
      });
    }
    if (error.errors.lastname) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        msg: `Last Name ${error.errors.lastname.message} letters`,
        errorType: "lastnameError",
      });
    }
    if (error.errors.username) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        msg: `Username ${error.errors.username.message} letters`,
        errorType: "usernameError",
      });
    }
    if (error.errors.password) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        msg: `Password ${error.errors.password.message}`,
        errorType: "passwordError",
      });
    }
    // console.log(error.errors.password);
  }
  // response.end();
};

// SENDING VERIFICATION EMAIL
const sendVerificationMail = async function (
  { _id, email },
  uniqueString,
  response
) {
  const currentURL = "https://api-kids-spelling-game.onrender.com";
  //  HOTMAIL TRANSPORT
  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.EMAIL,
  //     pass: process.env.PASSWORD,
  //   },
  // });

  // ETHEREAL TRANSPORT
  const transporter = nodemailer.createTransport({
    host: "gmail",
    // port: 587,
    secure: true,
    auth: {
      user: "kidsspellinggame@gmail.com",
      pass: "Vikeepwesh@25",
    },
    // tls: {
    //   ciphers: "SSLv3",
    //   rejectUnauthorized: false,
    // },
  });

  const mailOptions = {
    from: "kidsspellinggame@gmail.com",
    to: email,
    subject: "Please Verify your Account",
    text: "Please Verify your account",
    html: `<div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h2>Please Verify Your Account</h2>
        <img
          style={{ height: "150px", borderRadius: "50%" }}
          src="https://res.cloudinary.com/dcuy6upus/image/upload/v1696029576/default_logo.png"
          alt="child logo"
        />
        <p>Please Verify your account by clicking the link <a href=${
          currentURL + "/register/verify/" + _id + "/" + uniqueString
        } >Link</a></p>
      </div>`,
  };

  try {
    const mail = await transporter.sendMail(mailOptions);
    // console.log({ mail });
  } catch (error) {
    console.log("error");
    console.log(error);

    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      msg: `Server Error. Please try again in some minutes!`,
      errorType: "serverError",
    });
  }
};
// RESENDING VERIFICATION EMAIL
const resendVerficationEmail = async (request, response) => {
  const { userId } = request.params;
  const currentUser = await SignUpSchema.findOne({ _id: userId });
  const { email } = currentUser;
  const currentTempUser = await TempUserSchema.findOneAndUpdate({ userId });
  // console.log(currentTempUser);
  if (!currentTempUser) return;
  const uniqueString = currentTempUser.uniqueString;
  sendVerificationMail({ _id: userId, email }, uniqueString, response);
  const saltRounds = Number(process.env.SALT_ROUNDS);
  bcrypt.hash(uniqueString, saltRounds).then(async (hashedString) => {
    currentTempUser.uuid = hashedString;
    currentTempUser.createdAt = Date.now();
    currentTempUser.expiresAt = Date.now() + 600000;
    await currentTempUser.save();
  });

  return response
    .status(StatusCodes.ACCEPTED)
    .json({ status: "Success", msg: "Verification Email Sent Successfully" });
};

// VERIFY EMAIL LINK
const verifyEmail = async (request, response) => {
  const { userId, uniqueString } = request.params;
  const currentUser = await SignUpSchema.findOne({ _id: userId });
  const currentTempUser = await TempUserSchema.findOne({ userId });

  if (!currentTempUser) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .sendFile(path.resolve(__dirname, "../views/linkExpired.html"));
  }
  const isUniqueStringOk = await bcrypt.compare(
    uniqueString,
    currentTempUser.uuid
  );
  if (!isUniqueStringOk) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .send(
        `<div><h2>Error!!!</h2> <h3>Not authorized to perform this action</h3></div>`
      );
  }
  if (currentTempUser.expiresAt < Date.now()) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .sendFile(path.resolve(__dirname, "../views/linkExpired.html"));
  }
  currentUser.verified = true;
  await currentUser.save();
  await TempUserSchema.deleteOne({ userId });
  return response
    .status(StatusCodes.OK)
    .sendFile(path.resolve(__dirname, "../views/emailVerified.html"));
};

// GET USER
const getUser = async (request, response) => {
  const { userId } = request.params;
  const currentUser = await SignUpSchema.findOne({ _id: userId });
  response.status(StatusCodes.OK).json({
    status: "Success",
    msg: "Email Verified!!!",
    verified: currentUser.verified,
  });

  response.end();
};
module.exports = { register, verifyEmail, resendVerficationEmail, getUser };
