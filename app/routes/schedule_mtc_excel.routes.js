const { authJwt } = require("../middleware");
const schedule_mtc_excel = require("../controllers/schedule_mtc_excel.controller.js");
const uploadExcel = require("../middleware/uploadExcel");

module.exports = (app) => {
  var router = require("express").Router();

  router.post(
    "/",
    [
      authJwt.verifyToken,
      uploadExcel.single("file"),
    ],
    schedule_mtc_excel.uploadFiles
  );

  // read all schedule_mtc_excel
  router.get("/", [authJwt.verifyToken], schedule_mtc_excel.findAll);

  router.get("/:id", [authJwt.verifyToken], schedule_mtc_excel.findOne);

  // delete schedule_mtc_excel by id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    schedule_mtc_excel.deleteById
  );

  app.use("/api/schedule_mtc_excel", router);
};
