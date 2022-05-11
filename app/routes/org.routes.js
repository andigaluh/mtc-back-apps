const { authJwt } = require("../middleware");
const org = require("../controllers/org.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Org_class
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], org.create);

  // Retrieve all Org_classs
  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], org.findAll);

  // Retrieve all published Org_classs
  router.get("/published", org.findAllPublished);

  // Retrieve a single Org_class with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], org.findOne);

  // Update a Org_class with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], org.update);

  // Delete a Org_class with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    org.delete
  );

  // Delete all Org_classs
  router.delete(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    org.deleteAll
  );

  app.use("/api/org", router);
};
