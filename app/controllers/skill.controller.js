const db = require("../models");
const Skill = db.skill;

exports.getSkills = (req, res) => {
    Skill.find({}, (err, skills) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.send({ skills });
    });
  }

  exports.addSkill = (req, res) => {
    const skill = new Skill({
      label: req.body.label
    });
  
    skill.save((err, skill) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      res.status(201).send();
    });
  };