const db = require("../models");
const User = db.user;
const UserSkill = db.userSkill;
const Skill = db.skill;

  exports.addUserSkill = (req, res) => {
    User.findOne(
        {
          email: req.body.user
        },
        (err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          Skill.findOne(
            {
              label: req.body.skill
            },
            (err, skill) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              
              const userSkill = new UserSkill({
                user: user.id,
                skill: skill.id,
                level: req.body.level
              });

              userSkill.save(err => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
    
                res.send({ message: "User skill was registered successfully!" });
              });
            }
          );
        }
      );
  };

  exports.getUserSkillss = (req, res) => {
    UserSkill.find({}).populate("user", "-__v")
    .populate("skill", "-__v")
    .exec((err, users) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ userSkills :  users.map(u => ({
        _id: u._id,
        email: u.user.email,
        name: u.user.name,
        skill: u.skill.label,
        level : u.level
      })) });
    });
  }