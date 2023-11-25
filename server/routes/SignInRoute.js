const express = require("express");
const router = express.Router();
const { signIn } = require("../controllers/SignInController");

router.route("/api/v1/sign-in").post(signIn);

module.exports = router;
