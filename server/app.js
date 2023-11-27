const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
require("dotenv").config();
const start = require("./utils/ConnectDB");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {
  signUpRouter,
  signInRouter,
  forgotPasswordRouter,
  dashboardRouter,
  editProfileRouter,
  gameRouter,
} = require("./routes");

const originLink = "https://kids-game-nus8.onrender.com";
// const originLink = "http://localhost:3000";

// MIDDLEWARE
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: originLink,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
// app.use(express.static());
app.use(function (request, response, next) {
  // response.header("Content-Type", "application/json;charset=UTF-8");
  response.header("Access-Control-Allow-Credentials", true);
  response.header(
    "Access-Control-Allow-Origin",
    "https://kids-game-nus8.onrender.com"
    // "https://kids-game.onrender.com"
  );
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(signUpRouter);
app.use(signInRouter);
app.use(forgotPasswordRouter);
app.use(dashboardRouter);
app.use(editProfileRouter);
app.use(gameRouter);

const connect = async () => {
  try {
    await start();
    app.listen(port, console.log(`App is listening on ${port}`));
  } catch (error) {
    console.log({ errorMessage: error.message });
  }
};

connect();
