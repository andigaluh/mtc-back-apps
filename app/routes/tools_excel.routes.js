const { authJwt } = require("../middleware");
const tools_excel = require("../controllers/tools_excel.controller.js");
const uploadExcel = require("../middleware/uploadExcel");

module.exports = (app) => {
  var router = require("express").Router();

  router.post(
    "/",
    [
      authJwt.verifyToken,
      uploadExcel.single("file"),
    ],
    tools_excel.uploadFiles
  );

  // read all tools_excel
  router.get("/", [authJwt.verifyToken], tools_excel.findAll);

  router.get("/:id", [authJwt.verifyToken], tools_excel.findOne);

  // delete tools_excel by id
  router.delete(
    "/:id",
    [authJwt.verifyToken],
    tools_excel.deleteById
  );

  app.use("/api/tools_excel", router);
};
