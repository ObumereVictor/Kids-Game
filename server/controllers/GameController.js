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
  let games = await GameSchema.find({}).select("game");

  let iterator = games.values();

  for (let values of iterator) {
    let t = values.game.map((game) => game.game).join("");
    if (t === game) {
      console.log("game ");
      return response
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ status: "Failed", msg: "Game is already avaliable" });
    }
  }

  game = [...game];
  game = game.map((game, index) => {
    return { gid: index, game };
  });
  const newGame = await GameSchema.create({ game, difficulty });
  // console.log(newGame);

  return response
    .status(StatusCodes.CREATED)
    .json({ status: "Success ", msg: " Game Added" });
};

// GETTING GAME
const gettingGame = async (request, response) => {
  try {
    const user = request.user;
    let currentUser = await SignUpSchema.findOne({ _id: user });

    currentUser.gamesPlayed.map((game) => [...game]).join("");

    const userGames = await GameSchema.find({
      difficulty: currentUser.difficulty,
    }).select("game");

    let avaliableGames = userGames.map((games) => {
      return games.game;
    });

    let currentGames = avaliableGames.filter((game, index) => {
      let wordsArray = [];
      let words = game.map((game) => [...game.game]);
      words = wordsArray.concat(...words).join("");

      if (currentUser.gamesPlayed.includes(words)) {
        return game !== game;
      }
      return game;
    });

    let currentGame = await currentGames[0];
    // console.log(currentGame);
    let gameId;

    if (!currentGame) {
      return response.status(StatusCodes.NOT_FOUND).json({
        status: "Failed",
        msg: "You don't have any game available, change the difficulty level on your profile or try again later",
        errorType: "nogameerror",
      });
    }
    let currentGameWord = currentGame.map((g) => g.game).join("");
    let games = await GameSchema.find({}).select("game");
    let iterator = games.values();

    for (let values of iterator) {
      let game = values.game.map((g) => g.game).join("");
      if (currentGameWord === game) {
        gameId = values._id;
      }
    }

    const game = shuffleArray([...currentGame]);
    let answer = [...currentGame];
    answer = answer.map((answer) => answer.game);

    if (currentUser.difficulty === "Easy") {
      return response.status(200).json({
        status: "Success",
        msg: "You have a game to play",
        gameId,
        game,
        answer,
      });
    }

    return response.status(200).json({
      status: "Success",
      msg: "You have a game to play",
      gameId,
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
  // console.log({ userAnswer });
  // return;

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

  let findGameArray = [];
  let findGame = await GameSchema.findOne({ _id: gameId });
  // console.log(findGame);
  findGame = findGame.game.map((game) => [...game.game]);
  findGame = findGameArray.concat(...findGame).join("");
  console.log({ findGame, userAnswer });
  // return response.status(StatusCodes.OK);
  if (userAnswer !== findGame) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Did not get the correct spelling" });
  }
  const user = await SignUpSchema.findOne({ _id });
  await user.gamesPlayed.push(findGame);
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
