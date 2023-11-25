const express = require("express");
const router = express.Router();
const {
  register,
  verifyEmail,
  resendVerficationEmail,
  getUser,
} = require("../controllers/SignUpController");

router.route("/api/v1/register").post(register);
router.route("/api/v1/register/verify/:userId/:uniqueString").get(verifyEmail);
router.route("/api/v1/register/:userId").post(resendVerficationEmail);
router.route("/api/v1/register/:userId").get(getUser);

module.exports = router;
