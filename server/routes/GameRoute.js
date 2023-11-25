const express = require("express");
const router = express.Router();
const {
  createGame,
  checkGame,
  fetchNextGame,
  gettingGame,
} = require("../controllers/GameController");
const AuthenticateUser = require("../middleware/AuthenticateUser");
const authorizePermission = require("../middleware/AuthorizePermission");

router
  .route("/api/v1/dashboard/create-game/:token")
  .post(AuthenticateUser, authorizePermission("admin"), createGame);
router
  .route("/api/v1/playgame/:token/:gameId")
  .get(AuthenticateUser, authorizePermission("admin", "user"), gettingGame)
  .patch(AuthenticateUser, authorizePermission("admin", "user"), fetchNextGame)
  .post(AuthenticateUser, authorizePermission("admin", "user"), checkGame);
module.exports = router;
