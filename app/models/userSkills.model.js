const mongoose = require("mongoose");

const UserSkills = mongoose.model(
  "UserSkills",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill"
      },
    level: Number
  })
);

module.exports = UserSkills;