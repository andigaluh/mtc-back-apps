const { authJwt } = require("../middleware");
const org_class = require("../controllers/org_class.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Org_class
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], org_class.create);

  // Retrieve all Org_classs
  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], org_class.findAll);

  // Retrieve all published Org_classs
  router.get("/published", org_class.findAllPublished);

  // Retrieve a single Org_class with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], org_class.findOne);

  // Update a Org_class with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], org_class.update);

  // Delete a Org_class with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    org_class.delete
  );

  // Delete all Org_classs
  router.delete(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    org_class.deleteAll
  );

  app.use("/api/org_class", router);
};
