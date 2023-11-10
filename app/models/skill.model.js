const mongoose = require("mongoose");

const Skill = mongoose.model(
  "Skill",
  new mongoose.Schema({
    label: String
  })
);

module.exports = Skill;