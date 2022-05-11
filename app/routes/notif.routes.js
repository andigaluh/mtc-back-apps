const { authJwt } = require("../middleware");
const notif = require("../controllers/notif.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // Retrieve all Machines
  router.get(
    "/",
    [authJwt.verifyToken],
    notif.findAll
  );

  router.get("/unread", [authJwt.verifyToken], notif.findUnread);

  router.delete("/:id", [authJwt.verifyToken], notif.delete);

  router.get("/:id", [authJwt.verifyToken], notif.findOne);

  app.use("/api/notif", router);
};
