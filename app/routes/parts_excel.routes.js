const { authJwt } = require("../middleware");
const parts_excel = require("../controllers/parts_excel.controller.js");
const uploadExcel = require("../middleware/uploadExcel");

module.exports = (app) => {
  var router = require("express").Router();

  router.post(
    "/",
    [
      authJwt.verifyToken,
      uploadExcel.single("file"),
    ],
    parts_excel.uploadFiles
  );

  // read all parts_excel
  router.get("/", [authJwt.verifyToken], parts_excel.findAll);

  router.get("/:id", [authJwt.verifyToken], parts_excel.findOne);

  // delete parts_excel by id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    parts_excel.deleteById
  );

  app.use("/api/parts_excel", router);
};
