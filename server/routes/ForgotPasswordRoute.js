const express = require("express");
const router = express.Router();
const {
  sendResetPasswordEmail,
  verifyResetPasswordLink,
  updatePassword,
} = require("../controllers/ForgotPasswordController");

router.route("/api/v1/forgot-password").post(sendResetPasswordEmail);
router
  .route("/api/v1/reset-password/:token")
  .get(verifyResetPasswordLink)
  .post(updatePassword);

module.exports = router;
