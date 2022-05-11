const { authJwt } = require("../middleware");
const shift = require("../controllers/shift.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Org_class
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], shift.create);

  // Retrieve all Org_classs
  router.get("/", [authJwt.verifyToken], shift.findAll);

  // Retrieve all published Org_classs
  router.get("/published", shift.findAllPublished);

  // Retrieve a single Org_class with id
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    shift.findOne
  );

  // Update a Org_class with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], shift.update);

  // Delete a Org_class with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    shift.delete
  );

  // Delete all Org_classs
  router.delete(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    shift.deleteAll
  );

  app.use("/api/shift", router);
};
