const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log("Connected to the Db");
  } catch (error) {
    throw Error(error.message);
  }
};
module.exports = start;
