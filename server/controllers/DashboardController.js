const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const SignUpSchema = require("../models/SignUpModel");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { cloudinaryConfig } = require("../utils/config");
const GameSchema = require("../models/GameModel");

// UPLOAD IMAGE
const uploadImage = async (request, response) => {
  let image = request.file;

  if (!image) {
    return;
  }
  //  CHECK FILE TYPE
  if (!image.mimetype.startsWith("image/")) {
    return response.status(StatusCodes.FORBIDDEN).json({
      status: "Failed",
      msg: "Upload an image file",
      errorType: "notimage",
    });
  }

  // CHECKING IMAGE SIZE

  if (image.size > 1500000) {
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({
      status: "Failed",
      msg: "File size it too big. Please select an image with lower MB",
      errorType: "fileerror",
    });
  }

  cloudinaryConfig;

  const imageUrl = await cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      throw new Error(error);
    }
    image = result.secure_url;
    // console.log(image);
    response
      .status(StatusCodes.OK)
      .json({ status: "Success", msg: "Profile Updated successfully", image });
  });

  streamifier.createReadStream(image.buffer).pipe(imageUrl);
  // response.end();
};

// GET USER TO COMPLETE PROFILE
const getUser = async (request, response) => {
  const { userId, token } = request.params;

  const user = request.user;

  // IF NOT USER
  if (user !== userId) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "Failed", msg: "User not found" });
  }
  const currentUser = await SignUpSchema.findOne({ _id: user });

  return response.status(StatusCodes.OK).json({
    status: "Success",
    msg: "Active User",
    difficulty: currentUser.difficulty,
    profilePic: currentUser.profilePic,
  });
};

// COMPLETE PROFILE
const completeProfile = async (request, response) => {
  const { userId, token } = request.params;
  const { difficulty, imageUrl } = request.body;
  // console.log({ userId, token, difficulty, imageUrl });

  const user = request.user;
  if (user !== userId) {
    return response
      .status(StatusCodes.FORBIDDEN)
      .json({ status: "Failed", msg: "Unable to complete this profile" });
  }

  await SignUpSchema.findOneAndUpdate(
    { _id: user },
    { profilePic: imageUrl, difficulty, completedProfile: true }
  );
  response.end();
};

//  HANDLE DASHBOARD
const dashboard = async (request, response) => {
  if (!request.headers.authorization) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Cannot Perform this account",
    });
  }
  const token = request.headers.authorization.split("Bearer ")[1];
  console.log(token);

  if (!token) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Cannot Perform this account",
    });
  }
  const tokenData = jwt.verify(token, process.env.JWT_KEY);

  if (tokenData.exp > Date.now()) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Please sign in",
      errorType: "tokenexpired",
    });
  }
  const { _id } = tokenData;

  const user = await SignUpSchema.findOne({ _id });
  if (!user) {
    return;
  }
  if (!user.verified) {
    return response.status(StatusCodes.UNAUTHORIZED).json({
      status: "Failed",
      msg: "Please verify your account",
      errorType: "verifyaccount",
    });
  }

  if (!user.completedProfile) {
    // console.log(response.cookie);
    return response.status(StatusCodes.UNAUTHORIZED).json({
      status: "Failed",
      msg: "Please Complete your profile",
      errorType: "completeprofile",
      userId: user._id,
    });
  }
  const { profilePic, difficulty, role, username } = user;
  const game = await GameSchema.findOne({ difficulty });
  return response.status(StatusCodes.OK).json({
    profilePic,
    difficulty,
    role,
    username,
  });
  // response.end();
};

//  GETTTING USER

module.exports = { dashboard, uploadImage, completeProfile, getUser };
