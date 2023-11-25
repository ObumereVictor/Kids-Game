const express = require("express");
const router = express.Router();
const { editProfile } = require("../controllers/EditProfileController");
const multer = require("multer");
const AuthenticateUser = require("../middleware/AuthenticateUser");
const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/api/v1/dashboard/edit-profile/:token")
  .post(AuthenticateUser, upload.single("profilepic"), editProfile);

module.exports = router;
