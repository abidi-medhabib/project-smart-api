const mongoose = require("mongoose");

const Board = mongoose.model(
  "Board",
  new mongoose.Schema({
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },
    columns: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column"
    }],
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }],
  })
);

module.exports = Board;