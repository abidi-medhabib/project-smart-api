var mongoose = require('mongoose');
const db = require("../models");
const Project = db.project;
const Board= db.board;

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
  
    project.save((err, project) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      
      const board = new Board({
        project: project._id,
        columns: [
          "654e288f894b42d7473d250f",
          "654e2897894b42d7473d2513",
          "654e65340cb0a3b8026027b3"
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
  };
