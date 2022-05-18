const { authJwt } = require("../middleware");
const report_machine_check = require("../controllers/report_machine_check.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Machine
  //router.post("/", [authJwt.verifyToken, authJwt.isAdmin], report_machine_check.create);

  router.get("/summary",  report_machine_check.cronjobSummary);

  router.get("/download", report_machine_check.download);

  // Retrieve all Machines
  router.get(
    "/",
    [authJwt.verifyToken],
    report_machine_check.findAll
  );

  // Retrieve all published Machines
  //router.get("/published", report_machine_check.findAllPublished);

  // Retrieve a single Machine with id
  router.get(
    "/:id",
    [authJwt.verifyToken],
    report_machine_check.findOne
  );

  // Update a Machine with id
  //router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], report_machine_check.update);

  // Update a Machine with id
  router.put(
    "/parts/:machine_check_id/:parts_id",
    [authJwt.verifyToken],
    report_machine_check.updatePartsCondition
  ); 

  // Delete a Machine with id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    report_machine_check.delete
  );

  // Delete all Machines
  router.delete(
    "/",
    [authJwt.verifyToken],
    report_machine_check.deleteAll
  );

  router.get("/statusUpdated/:machine_check_id", [authJwt.verifyToken], report_machine_check.statusUpdatedParts)
  

  app.use("/api/report-machine-check", router);
};
