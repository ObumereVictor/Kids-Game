const mongoose = require("mongoose");

const SignUpSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Must be more than 3"],
      maxlength: [20, "Must be less than 20"],
      match: /^[A-Za-z]+$/,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Must be more than 3"],
      maxlength: [20, "Must be less than 20"],
      match: /^[A-Za-z]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /[@]/,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Must be more than 3"],
      maxlength: [12, "Must be less than 20"],
    },
    age: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, "Must be more than 6"],
      // maxlength: [15, "Must be less than 15"],
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    repassword: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: Object,
    },
    gamesPlayed: {
      type: Array,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dcuy6upus/image/upload/v1696029576/default_logo.png",
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    completedProfile: {
      type: Boolean,
      default: false,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kids", SignUpSchema);
