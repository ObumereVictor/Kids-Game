const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const AuthenticateUser = (request, response, next) => {
  const authenticationToken = request.params.token;
  const data = jwt.verify(authenticationToken, process.env.JWT_KEY);
  if (data.exp > Date.now()) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Failed",
      msg: "Invalid Token",
      errorType: "invalidToken",
    });
  }
  request.user = data._id;
  request.role = data.role;

  next();
};

module.exports = AuthenticateUser;
