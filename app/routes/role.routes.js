const role = require("../controllers/role.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new role
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], role.create);

  // Retrieve all roles
  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], role.findAll);

  // Retrieve a single role with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], role.findOne);

  // Update a role with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], role.update);

  // Delete a role with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], role.delete);

  app.use("/api/role", router);
};
