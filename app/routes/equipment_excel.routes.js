const { authJwt } = require("../middleware");
const equipment_excel = require("../controllers/equipment_excel.controller.js");
const uploadExcel = require("../middleware/uploadExcel");

module.exports = (app) => {
  var router = require("express").Router();

  router.post(
    "/",
    [authJwt.verifyToken, uploadExcel.single("file")],
    equipment_excel.uploadFiles
  );

  // read all equipment_excel
  router.get("/", [authJwt.verifyToken], equipment_excel.findAll);

  router.get("/:id", [authJwt.verifyToken], equipment_excel.findOne);

  // delete equipment_excel by id
  router.delete("/:id", [authJwt.verifyToken], equipment_excel.deleteById);

  app.use("/api/equipment_excel", router);
};
