const mongoose = require("mongoose");

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({
    name: String,
    description: String
  })
);

module.exports = Project;