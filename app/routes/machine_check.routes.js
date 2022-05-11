const { authJwt } = require("../middleware");
const machine_check = require("../controllers/machine_check.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Machine
  router.post(
    "/",
    [authJwt.verifyToken],
    machine_check.create
  );

  // Update a Machine with id
  router.put(
    "/:id",
    [authJwt.verifyToken],
    machine_check.update
  );

  router.put("/appr/:id",[authJwt.verifyToken], machine_check.mgr_approval);

  router.get("/find-appr", [authJwt.verifyToken], machine_check.findAppr);

  /* // Retrieve all Machines
  router.get(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.isOperator],
    machine.findAll
  );

  // Retrieve all published Machines
  router.get("/published", machine.findAllPublished);

  // Retrieve a single Machine with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], machine.findOne);

  // Update a Machine with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], machine.update);

  // Update a Machine with id
  router.put(
    "/parts/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    machine.updateParts
  );

  // Delete a Machine with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], machine.delete);

  // Delete all Machines
  router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], machine.deleteAll); */

  app.use("/api/machine-check", router);
};
