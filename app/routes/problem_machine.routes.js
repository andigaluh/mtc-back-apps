const { authJwt } = require("../middleware");
const problem_machine = require("../controllers/problem_machine.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  router.get("/download", problem_machine.download);

  // Create a new Machine
  router.post(
    "/",
    [authJwt.verifyToken],
    problem_machine.create
  );

  // Retrieve all Machines
  router.get(
    "/",
    [authJwt.verifyToken],
    problem_machine.findAll
  );

  // Retrieve a single Machine with id
  router.get(
    "/:id",
    [authJwt.verifyToken],
    problem_machine.findOne
  );

  // Update a Machine with id
  router.put(
    "/:id",
    [authJwt.verifyToken],
    problem_machine.update
  );


  // Delete a Machine with id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    problem_machine.delete
  );

  // Delete all Machines
  router.delete(
    "/",
    [authJwt.verifyToken],
    problem_machine.deleteAll
  );

  

  app.use("/api/problem_machine", router);
};
