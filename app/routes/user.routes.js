const { authJwt, verifyUser } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin, verifyUser.checkRolesExisted],
    controller.addUser
  );

  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isPM],
    controller.getUsers
  );

  app.delete(
    "/api/users/:userId",
    [authJwt.verifyToken],
    controller.deleteUser
  );
};