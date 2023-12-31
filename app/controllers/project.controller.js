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

exports.getProject = (req, res) => {
    Project.findOne({ _id : req.params.projectId}, (err, project) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ project });
    });
  }

exports.deleteProject = (req, res) => {
    Project.deleteOne({ _id : req.params.projectId}, (err, project) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send();
    });
  }

  exports.addProject = (req, res) => {

    Project.findOne({ _id : req.body._id}, (err, existingProject) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      
      if(existingProject) {
        existingProject.name= req.body.name;
        existingProject.description= req.body.description;
        existingProject.client= req.body.client;
        existingProject.category= req.body.category;
        existingProject.startDate= req.body.startDate;
        existingProject.endDate= req.body.endDate;

        existingProject.save((err, project) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          
          res.status(201).send();
        });
      } else {
        const project = new Project({
          _id: req.body._id ? req.body._id : new mongoose.Types.ObjectId(),
          name: req.body.name,
          description: req.body.description,
          client: req.body.client,
          category: req.body.category,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
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
        });
      }      
    });
  };
