const { authJwt } = require("../middleware");
const doc_inspection = require("../controllers/doc_inspection.controller.js");
const uploadFile = require("../middleware/uploadFile");

module.exports = (app) => {
  var router = require("express").Router();

  router.post(
    "/",
    [
      authJwt.verifyToken,
      uploadFile.single("file"),
    ],
    doc_inspection.uploadFiles
  );

  // read all doc_inspection
  router.get(
    "/",
    [authJwt.verifyToken],
    doc_inspection.findAll
  );

  router.get(
    "/:id",
    [authJwt.verifyToken],
    doc_inspection.findOne
  );

  // delete doc_inspection by id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    doc_inspection.deleteById
  );

  // Update a Job_class with id
  router.put(
    "/:id",
    [
      authJwt.verifyToken,
      uploadFile.single("file"),
    ],
    doc_inspection.update
  );

  app.use("/api/doc_inspection", router);
};
