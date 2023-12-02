const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const path = require("path");
const { cloudinaryConfig } = require("../utils/config");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const SignUpSchema = require("../models/SignUpModel");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// EDIT PROFILE
const editProfile = async (request, response) => {
  const { difficulty } = request.body;
  const image = request.file;
  const { token } = request.params;
  const user = request.user;
  const isTokenValid = jwt.verify(token, process.env.JWT_KEY);

  if (isTokenValid._id !== user) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Cannot update this profile" });
  }
  // // NO USERNAME INPUT
  // if (!username) {
  //   return response
  //     .status(StatusCodes.BAD_REQUEST)
  //     .json({ status: "Failed", msg: "Enter username" });
  // }
  //  CHECK FILE TYPE
  if (image && !image.mimetype.startsWith("image/")) {
    return response.status(StatusCodes.FORBIDDEN).json({
      status: "Failed",
      msg: "Upload an image file",
      errorType: "notimage",
    });
  }

  // CHECKING IMAGE SIZE

  if (image && image.size > 1500000) {
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({
      status: "Failed",
      msg: "File size it too big. Please select an image with lower MB",
      errorType: "fileerror",
    });
  }

  const { _id } = await SignUpSchema.findOne({ _id: user });
  // if (isUsernameAvailable) {
  //   return response
  //     .status(StatusCodes.BAD_REQUEST)
  //     .json({ status: "Failed", msg: "Username already exists" });
  // }
  if (!_id) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Cannot Perform this action" });
  }
  cloudinaryConfig;

  const imageUrl = cloudinary.uploader.upload_stream(async (error, result) => {
    if (error) {
      return error;
    }
    await SignUpSchema.updateMany({ _id }, { profilePic: result.secure_url });
  });

  if (image) {
    streamifier.createReadStream(image.buffer).pipe(imageUrl);
  }

  // if (username) {
  //   await SignUpSchema.updateMany({ _id: user }, { username });
  // }
  if (difficulty) {
    await SignUpSchema.updateMany({ _id }, { difficulty });
  }

  return response
    .status(StatusCodes.OK)
    .json({ status: "Success", msg: "Profile Updated Completely" });
};

module.exports = { editProfile };
