const mongoose = require("mongoose");

const Column = mongoose.model(
  "Column",
  new mongoose.Schema({
    name: String
  })
);

module.exports = Column;