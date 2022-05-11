const { authJwt } = require("../middleware");
const tools = require("../controllers/tools.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new tools
  router.post("/", [authJwt.verifyToken], tools.create);

  // Retrieve all tools
  router.get("/", [authJwt.verifyToken], tools.findAll);

  // Retrieve all tools published
  router.get("/published", tools.findAllPublished);

  // Retrieve  single tools  with id
  router.get(
    "/:id",
    [authJwt.verifyToken],
    tools.findOne
  );

  // Update a tools  with id
  router.put("/:id", [authJwt.verifyToken], tools.update);

  // Delete a tools with id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    tools.delete
  );

  // Delete all tools
  router.delete(
    "/",
    [authJwt.verifyToken],
    tools.deleteAll
  );

  app.use("/api/tools", router);
};
