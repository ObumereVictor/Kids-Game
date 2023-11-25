const mongoose = require("mongoose");

const TempUserSchema = mongoose.Schema({
  userId: String,
  uuid: String,
  uniqueString: String,
  createdAt: Date,

  expiresAt: Date,
});

module.exports = mongoose.model("TempKids", TempUserSchema);
