const { authJwt } = require("../middleware");
const job = require("../controllers/job.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Job
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], job.create);

  // Retrieve all Jobs
  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], job.findAll);

  // Retrieve all published Jobs
  router.get("/published", job.findAllPublished);

  // Retrieve a single Job with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], job.findOne);

  // Update a Job with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], job.update);

  // Delete a Job with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], job.delete);

  // Delete all Jobs
  router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], job.deleteAll);

  app.use("/api/job", router);
};
