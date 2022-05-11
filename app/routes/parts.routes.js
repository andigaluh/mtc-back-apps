const { authJwt } = require("../middleware");
const parts = require("../controllers/parts.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  router.get("/download", parts.download);

  // Create a new Machine
  router.post("/", [authJwt.verifyToken], parts.create);

  // Retrieve all Machines
  router.get("/", [authJwt.verifyToken], parts.findAll);

  // Retrieve all published Machines
  router.get("/published", parts.findAllPublished);

  // Retrieve a single Machine with id
  router.get("/:id", [authJwt.verifyToken], parts.findOne);

  // Update a Machine with id
  router.put("/:id", [authJwt.verifyToken], parts.update);

  // Delete a Machine with id
  router.delete("/:id", [authJwt.verifyToken], parts.delete);

  // Delete all Machines
  router.delete("/", [authJwt.verifyToken], parts.deleteAll);

  app.use("/api/parts", router);
};
