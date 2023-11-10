const { authJwt } = require("../middlewares");
const controller = require("../controllers/userSkills.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/user-skills",
    [authJwt.verifyToken, authJwt.isPM],
    controller.getUserSkillss
  );

  app.post(
    "/api/user-skills",
    [authJwt.verifyToken, authJwt.isPM],
    controller.addUserSkill
  );
};