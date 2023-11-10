var mongoose = require('mongoose');
const db = require("../models");
const Project = db.project;
const Board= db.board;
const Column= db.column;

exports.getProjects = (req, res) => {
    Project.find({}, (err, projects) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ projects });
    });
  }

  exports.addProject = (req, res) => {
    const project = new Project({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.description,
    });
    const todoCol = new Column({
      _id: new mongoose.Types.ObjectId(),
      name: "Todo"
    });
    const progressCol = new Column({
      _id: new mongoose.Types.ObjectId(),
      name: "Progress"
    });
    const doneCol = new Column({
      _id: new mongoose.Types.ObjectId(),
      name: "Done"
    });
    
    todoCol.save((err, col1) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      progressCol.save((err, col2) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        doneCol.save((err, col3) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          project.save((err, project) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            
            const board = new Board({
              project: project._id,
              columns: [
                todoCol._id,
                progressCol._id,
                doneCol._id,
              ]
            });
          
            board.save((err, board) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              res.status(201).send();
            });
          });
        })
      })
    })
  };
