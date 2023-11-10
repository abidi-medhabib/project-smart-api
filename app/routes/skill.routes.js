const { authJwt } = require("../middlewares");
const controller = require("../controllers/skill.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/skills",
    [authJwt.verifyToken, authJwt.isPM],
    controller.getSkills
  );

  app.post(
    "/api/skills",
    [authJwt.verifyToken, authJwt.isPM],
    controller.addSkill
  );
};