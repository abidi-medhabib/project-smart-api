const mongoose = require("mongoose");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    message: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    createdAt: Date
  })
);

module.exports = Comment;