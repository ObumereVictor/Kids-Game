const mongoose = require("mongoose");

const GameSchema = mongoose.Schema({
  game: {
    type: String,
  },
  difficulty: {
    type: String,
  },
});

module.exports = mongoose.model("Game", GameSchema);
