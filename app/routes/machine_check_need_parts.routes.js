const { authJwt } = require("../middleware");
const machine_check_need_parts = require("../controllers/machine_check_need_parts.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Retrieve all published Machines
  router.get("/find-by-parts/:id", machine_check_need_parts.findAllByParts);

  app.use("/api/machine-check-need-parts", router);
};
