const { authJwt } = require("../middleware");
const machine = require("../controllers/machine.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new Machine
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], machine.create);

  // Retrieve all Machines
  router.get("/", [authJwt.verifyToken], machine.findAll);

  // Retrieve all published Machines
  router.get("/published", machine.findAllPublished);

  // Retrieve a single Machine with id
  router.get(
    "/:id",
    [authJwt.verifyToken],
    machine.findOne
  );

  router.get("/code/:code", [authJwt.verifyToken], machine.findOneByCode);

  // Update a Machine with id
  router.put("/:id", [authJwt.verifyToken], machine.update);

  // Update a Machine with id
  router.put("/parts/:id", [authJwt.verifyToken], machine.updateParts);

  // Delete a Machine with id
  router.delete("/:id", [authJwt.verifyToken], machine.delete);

  // Delete all Machines
  router.delete("/", [authJwt.verifyToken], machine.deleteAll);

  app.use("/api/machine", router);
};
