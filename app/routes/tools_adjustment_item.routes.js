const { authJwt } = require("../middleware");
const tools_adjustment_item = require("../controllers/tools_adjustment_item.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  router.get("/download/:id", tools_adjustment_item.download);

  // Create a new Machine
  router.post(
    "/",
    [authJwt.verifyToken],
    tools_adjustment_item.create
  );

  // Retrieve all Machines
  router.get(
    "/",
    [authJwt.verifyToken],
    tools_adjustment_item.findAll
  );

  // Retrieve all published Machines
  router.get("/published", tools_adjustment_item.findAllPublished);

  // Retrieve a single Machine with id
  router.get(
    "/parts/:id",
    [authJwt.verifyToken],
    tools_adjustment_item.findAllByTools
  );

  // Retrieve a single Machine with id
  router.get(
    "/:id",
    [authJwt.verifyToken],
    tools_adjustment_item.findOne
  );

  // Update a Machine with id
  router.put(
    "/:id",
    [authJwt.verifyToken],
    tools_adjustment_item.update
  );

  // Delete a Machine with id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    tools_adjustment_item.delete
  );

  // Delete all Machines
  router.delete(
    "/",
    [authJwt.verifyToken],
    tools_adjustment_item.deleteAll
  );

  // Retrieve a single Machine with id
  router.get(
    "/tools/:id",
    [authJwt.verifyToken],
    tools_adjustment_item.findAllByTools
  );

  app.use("/api/tools_adjustment_item", router);
};
