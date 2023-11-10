var mongoose = require('mongoose');
const db = require("../models");
const Column = db.column;
const Task = db.task;
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

      const cols = board.columns.map(c => 
      {
        const colTasks = board.tasks.filter(t => t.column.equals(c._id));
        return {
          _id: c._id, 
          name: c.name, 
          taskIds: colTasks ? colTasks.map(t => t._id) : []
        };
      })

      res.send({ board : {
        columns: cols,
        tasks: board.tasks.map(c => ({_id: c._id, name: c.name, assigneesIds: [], comments: []})),
        members: []
      } });
    });
  }

exports.addTask = (req, res) => {
  Board.findOne({project : req.body.projectId})
    .exec((err, board) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      Column.findOne({_id : req.body.columnId})
        .exec((err, column) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          const task = new Task({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            column: column._id
          });

          task.save((err, _) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            board.tasks = [...board.tasks, task._id];
            
            board.save((err, _) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              
              res.send({_id: task._id, name: task.name, assigneesIds: [], comments: [], columnId: req.body.columnId});
            });
          });
        });
  });
  }