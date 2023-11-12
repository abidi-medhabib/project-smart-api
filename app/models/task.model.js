const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    name: String,
    description: String,
    assignees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    column: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column"
      },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }],
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill"
      }],
  })
);

module.exports = Task;