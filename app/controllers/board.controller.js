var mongoose = require('mongoose');
const nlp = require('compromise');
const db = require("../models");
const Column = db.column;
const Task = db.task;
const Board = db.board;
const Comment = db.comment;
const User = db.user;
const Skill = db.skill;

exports.getBoard = (req, res) => {
    Board.findOne({project : req.params.projectId})
    .populate("columns", "-__v")
    .populate({
      path: 'tasks',
      populate: "comments skills"
    })
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

      User.find({project : req.params.projectId})
      .exec((err, users) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        res.send({ board : {
          columns: cols,
          tasks: board.tasks.map(c => ({
            _id: c._id, 
            name: c.name, 
            description: c.description,
            labels: c.skills.map(s => s.label),
            assigneesIds: c.assignees,
            comments: c.comments.map(comment => ({
              id: comment._id,
              message: comment.message,
              authorId: comment.author,
              createdAt: comment.createdAt
            })), 
            columnId: c.column})),
          members: users.map(u => ({
            _id: u._id,
            name: u.name
          }))
        } });
      });
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

exports.moveTask = (req, res) => {
  Task.findOne({_id : req.body.taskId})
    .exec((err, task) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if( req.body.columnId) {
        Column.findOne({_id : req.body.columnId})
        .exec((err, targetColumn) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }    

          task.column = targetColumn._id;
          task.save((err, _) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
                    
            res.status(200).send();
          });
        });
      } 
        
  });
  }

exports.addComment = (req, res) => {
  Task.findOne({_id : req.body.taskId})
    .exec((err, task) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        message: req.body.message,
        author: req.userId,
        createdAt: new Date().getTime()
      });

      comment.save((err, _) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
                
        task.comments = [...task.comments, comment._id];
        task.save((err, _) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
                  
          res.status(200).send({
            id: comment._id,
            message: comment.message,
            authorId: comment.author,
            createdAt: comment.createdAt
          });
        });
      });   
  });
  }

exports.updateTask = (req, res) => {
  Task.findOne({_id : req.body.taskId})  
    .populate("skills", "-__v")
    .populate("comments", "-__v")
    .exec((err, task) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      Skill.find({}, (err, skills) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        if(req.body.update.name) {
          task.name = req.body.update.name;
        }
        if(req.body.update.assigneesIds) {
          task.assignees = Array.from(new Set([...req.body.update.assigneesIds]))
        }

        if(req.body.update.labels){
          task.skills = req.body.update.labels.map(l => skills.find(s => s.label === l)._id);
        }

        if(req.body.update.description) {
          task.description = req.body.update.description;

          const tagsList = skills.map(s => s.label);
          const doc = nlp(task.description);

          const extractedTags = tagsList.filter(tag => tag.split(' ').find(x => doc.match(`${x}`).out('array').length > 0));
          extractedTags.forEach(element => {
            const skillToAdd = skills.find(s => s.label === element);
            
            if(!task.skills.find(t => t._id.equals(skillToAdd._id)) && !task.skills.find(s => s.equals(skillToAdd._id))) {
              task.skills = [...task.skills, skillToAdd];  
            }
          });
        }
              
        task.save((err, _) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          Task.findOne({_id : req.body.taskId})  
            .populate("skills", "-__v")
            .populate("comments", "-__v")
            .exec((err, task) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
                  
            res.send({
              _id: task._id, 
              name: task.name, 
              description: task.description,
              assigneesIds: task.assignees, 
              labels: task.skills.map(s => s.label),
              comments: task.comments.map(comment => ({
                id: comment._id,
                message: comment.message,
                authorId: comment.author,
                createdAt: comment.createdAt,
                description: task.description,
                labels: task.skills.map(s => s.label),
              })), 
              columnId: req.body.columnId});
            });
        });
      });
  });
  }