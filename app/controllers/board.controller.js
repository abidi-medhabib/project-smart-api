const db = require("../models");
const Board = db.board;

exports.getBoard = (req, res) => {
    Board.findOne({project : req.params.projectId})
    .populate("columns", "-__v")
    .populate("tasks", "-__v")
    .exec((err, board) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ board : {
        columns: board.columns,
        tasks: board.tasks,
        members: []
      } });
    });
  }