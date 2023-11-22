var bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };

  exports.addUser = (req, res) => {
    if(req.body._id) {
      User.findOne({ _id: req.body._id})
          .exec((err, userToEdit) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            userToEdit.name = req.body.name;
            userToEdit.email = req.body.email;

            Role.findOne(
              {
                name: req.body.role
              },
              (err, role) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
      
                userToEdit.role = role._id;
                userToEdit.save(err => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
      
                  res.send({ message: "User was registered successfully!" });
                });
              }
            );

          });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
      });
    
      user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        if (req.body.role) {
          Role.findOne(
            {
              name: req.body.role
            },
            (err, role) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
    
              user.role = role._id;
              user.save(err => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
    
                res.send({ message: "User was registered successfully!" });
              });
            }
          );
        } else {
          Role.findOne({ name: "Developper" }, (err, role) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
    
            user.role = role._id;
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
    
              res.send({ message: "User was registered successfully!" });
            });
          });
        }
      });
    }
  };

  exports.getUsers = (req, res) => {
    User.find({}).populate("role", "-__v")
    .exec((err, users) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ users :  users.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role.name,
        password: u.password
      })) });
    });
  }

  exports.deleteUser = (req, res) => {
    User.deleteOne({ _id : req.params.userId}, (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send();
    });
  }