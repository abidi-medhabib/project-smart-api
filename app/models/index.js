const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.project = require("./project.model");
db.skill = require("./skill.model");
db.userSkill = require("./userSkills.model");
db.column = require("./column.model");
db.comment = require("./comment.model");
db.task = require("./task.model");
db.board = require("./board.model");

db.ROLES = ['Admin', 'Project Manager', 'Manager', 'Developper'];

module.exports = db;