const { authJwt } = require("../middleware");
const job_class = require("../controllers/job_class.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Job_class
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], job_class.create);

  // Retrieve all Job_class
  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], job_class.findAll);

  // Retrieve all published Job_class
  router.get("/published", job_class.findAllPublished);

  // Retrieve a single Job_class with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], job_class.findOne);

  // Update a Job_class with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], job_class.update);

  // Delete a Job_class with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    job_class.delete
  );

  // Delete all Job_class
  router.delete(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    job_class.deleteAll
  );

  app.use("/api/job_class", router);
};
