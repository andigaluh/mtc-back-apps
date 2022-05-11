const { authJwt } = require("../middleware");
const tools_type = require("../controllers/tools_type.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new tools_type
  router.post("/", [authJwt.verifyToken], tools_type.create);

  // Retrieve all tools_type
  router.get("/", [authJwt.verifyToken], tools_type.findAll);

  // Retrieve all tools_type published
  router.get("/published", tools_type.findAllPublished);

  // Retrieve  single tools_type  with id
  router.get(
    "/:id",
    [authJwt.verifyToken],
    tools_type.findOne
  );

  // Update a tools_type  with id
  router.put("/:id", [authJwt.verifyToken], tools_type.update);

  // Delete a tools_type with id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    tools_type.delete
  );

  // Delete all tools_type
  router.delete(
    "/",
    [authJwt.verifyToken],
    tools_type.deleteAll
  );

  app.use("/api/tools_type", router);
};
