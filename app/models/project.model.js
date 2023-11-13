const mongoose = require("mongoose");

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({
    name: String,
    description: String,
    client: String,
    category: String,
    startDate: Date,
    endDate: Date
  })
);

module.exports = Project;