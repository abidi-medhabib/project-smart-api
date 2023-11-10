const { authJwt } = require("../middlewares");
const controller = require("../controllers/board.controller");

module.exports = function(app) {
  app.get(
      "/api/board/:projectId",
      [authJwt.verifyToken],
      controller.getBoard
    );

  app.post(
      "/api/board/tasks",
      [authJwt.verifyToken],
      controller.addTask
    );

}