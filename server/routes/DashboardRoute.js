const express = require("express");
const router = express.Router();
const AuthenticateUser = require("../middleware/AuthenticateUser");
const {
  dashboard,
  uploadImage,
  completeProfile,
  getUser,
} = require("../controllers/DashboardController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.route("/api/v1/dashboard/:token").get(AuthenticateUser, dashboard);
router
  .route("/api/v1/dashboard/complete-profile/:userId/:token")
  .get(AuthenticateUser, getUser)
  .post(AuthenticateUser, upload.single("profilepic"), uploadImage)
  .patch(AuthenticateUser, completeProfile);
module.exports = router;
