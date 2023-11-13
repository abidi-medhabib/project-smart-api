const { authJwt } = require("../middlewares");
const controller = require("../controllers/project.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/projects/:projectId",
    [authJwt.verifyToken],
    controller.getProject
  );

  app.delete(
    "/api/projects/:projectId",
    [authJwt.verifyToken],
    controller.deleteProject
  );

  app.get(
    "/api/projects",
    [authJwt.verifyToken],
    controller.getProjects
  );
  
  app.post(
    "/api/projects",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addProject
  );
};