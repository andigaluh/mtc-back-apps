const { authJwt } = require("../middleware");
const equipment = require("../controllers/equipment.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  router.get("/download", equipment.download);

  // Create a new Machine
  router.post("/", [authJwt.verifyToken], equipment.create);

  // Retrieve all Machines
  router.get("/", [authJwt.verifyToken], equipment.findAll);

  // Retrieve all published Machines
  router.get("/published", equipment.findAllPublished);

  // Retrieve a single Machine with id
  router.get("/:id", [authJwt.verifyToken], equipment.findOne);

  // Update a Machine with id
  router.put("/:id", [authJwt.verifyToken], equipment.update);

  // Delete a Machine with id
  router.delete("/:id", [authJwt.verifyToken], equipment.delete);

  // Delete all Machines
  router.delete("/", [authJwt.verifyToken], equipment.deleteAll);

  app.use("/api/equipment", router);
};
