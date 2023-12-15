const { StatusCodes } = require("http-status-codes");
const checkPermission = require("../utils/checkPermission");
const GameSchema = require("../models/GameModel");
const SignUpSchema = require("../models/SignUpModel");
const { shuffleArray } = require("../utils");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const jwt = require("jsonwebtoken");

// CREATE GAME

const createGame = async (request, response) => {
  let { game, difficulty } = request.body;
  game = game.toUpperCase().trim();
  if (!game) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Please Input a word" });
  }
  const user = request.user;
  if (!user) {
    return response
      .status(StatusCodes.BAD_GATEWAY)
      .json({ status: "Failed", msg: "Please Sign out and Sign in " });
  }
  const currentUser = await SignUpSchema.findOne({ _id: user });
  if (!currentUser) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Cannot perform this action" });
  }
  checkPermission(currentUser.role, user);

  const isGameAvaliable = await GameSchema.findOne({ game });

  if (isGameAvaliable) {
    return response
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ status: "Failed", msg: "Game is already avaliable" });
  }
  game = [...game];
  game = game.map((game, index) => {
    return { gid: index, game };
  });
  await GameSchema.create({ game, difficulty });

  return response
    .status(StatusCodes.CREATED)
    .json({ status: "Success ", msg: " Game Added" });
};

// GETTING GAME
const gettingGame = async (request, response) => {
  try {
    const user = request.user;
    console.log(user);
    const currentUser = await SignUpSchema.findOne({ _id: user });

    const userGames = await GameSchema.find({
      difficulty: currentUser.difficulty,
    }).select("game");
    // console.log(user.gamesPlayed);
    let avaliableGames = userGames.map((games) => {
      return games.game;
    });
    let currentGames = avaliableGames.filter((game, index) => {
      if (currentUser.gamesPlayed.includes(game)) {
        return game !== game;
      }
      return game;
    });
    console.log({ currentGames });

    let currentGame = await currentGames[0];
    console.log(currentGame);
    // let currentGame = await currentGames.at(0);

    if (!currentGame) {
      return response.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        msg: "You don't have any game available, change the difficulty level on your profile or try again later",
        errorType: "nogameerror",
      });
    }

    let { _id } = await GameSchema.findOne({ game: currentGame });
    const game = shuffleArray([...currentGame]);
    // console.log(currentGame);
    let answer = [...currentGame];
    answer = answer.map((answer) => answer.game);
    if (currentUser.difficulty === "Easy") {
      return response.status(200).json({
        status: "Success",
        msg: "You have a game to play",
        gameId: _id,
        game,
        answer,
      });
    }

    return response.status(200).json({
      status: "Success",
      msg: "You have a game to play",
      gameId: _id,
      game,
    });
  } catch (error) {
    console.log(error);
  }
};

// CHECK GAME
const checkGame = async (request, response) => {
  const { token, gameId } = request.params;
  const currentUser = request.user;
  const userAnswer = request.body.join("");
  console.log({ userAnswer });
  return;

  if (!userAnswer) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Cannot perform this action" });
  }

  const { _id, exp } = jwt.verify(token, process.env.JWT_KEY);
  if (currentUser !== _id) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Unable to perform this action" });
  }

  if (Date.now() < exp) {
    return response
      .status(StatusCodes.BAD_GATEWAY)
      .json({ status: "Failed", msg: "Please Login again" });
  }

  const findGame = await GameSchema.findOne({ _id: gameId });
  console.log(findGame);

  if (userAnswer !== findGame.game) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Did not get the correct spelling" });
  }
  const user = await SignUpSchema.findOne({ _id });
  user.gamesPlayed.push(findGame.game);
  await user.save();
  response
    .status(StatusCodes.OK)
    .json({ status: "Success", msg: "You got the spelling correct" });
};

// FETCH NEXT GAME

const fetchNextGame = async (request, response) => {
  const { gameId, token } = request.params;
  const user = request.user;

  const { _id, exp } = jwt.verify(token, process.env.JWT_KEY);

  if (user !== _id) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Cannot perform this action" });
  }
  if (Date.now() < exp) {
    return response
      .status(StatusCodes.BAD_GATEWAY)
      .json({ status: "Failed", msg: "Cannot perform this action" });
  }
  const currentUserPlayedGames = await SignUpSchema.findOne({ _id }).select(
    "gamesPlayed"
  );
  console.log(currentUserPlayedGames);
  return response
    .status(StatusCodes.OK)
    .json({ status: "Success", msg: "You have the next game to play" });
};

module.exports = { createGame, gettingGame, checkGame, fetchNextGame };
