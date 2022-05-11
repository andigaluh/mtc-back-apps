const { authJwt } = require("../middleware");
const parts_adjustment_item = require("../controllers/parts_adjustment_item.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Machine
  router.post(
    "/",
    [authJwt.verifyToken],
    parts_adjustment_item.create
  );

  // Retrieve all Machines
  router.get(
    "/",
    [authJwt.verifyToken],
    parts_adjustment_item.findAll
  );

  // Retrieve all published Machines
  router.get("/published", parts_adjustment_item.findAllPublished);

  // Retrieve a single Machine with id
  router.get(
    "/parts/:id",
    [authJwt.verifyToken],
    parts_adjustment_item.findAllByParts
  );

  // Retrieve a single Machine with id
  router.get(
    "/:id",
    [authJwt.verifyToken],
    parts_adjustment_item.findOne
  );

  // Update a Machine with id
  router.put(
    "/:id",
    [authJwt.verifyToken],
    parts_adjustment_item.update
  );

  // Delete a Machine with id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    parts_adjustment_item.delete
  );

  // Delete all Machines
  router.delete(
    "/",
    [authJwt.verifyToken],
    parts_adjustment_item.deleteAll
  );

  app.use("/api/parts_adjustment_item", router);
};
