const { authJwt } = require("../middleware");
const schedule_mtc = require("../controllers/schedule_mtc.controller.js");
const uploadFile = require("../middleware/uploadFile");

module.exports = (app) => {
    var router = require("express").Router();

    router.get("/download", schedule_mtc.download);

    router.get("/download_template", schedule_mtc.download_template);

    router.post(
        "/",
        [
        authJwt.verifyToken,
        uploadFile.single("file"),
        ],
        schedule_mtc.create
    );

    // read all schedule_mtc
    router.get(
      "/",
      [authJwt.verifyToken],
      schedule_mtc.findAll
    );

    router.get(
      "/:id",
      [authJwt.verifyToken],
      schedule_mtc.findOne
    );

    // delete schedule_mtc by id
    router.delete(
        "/:id",
        [authJwt.verifyToken],
        schedule_mtc.deleteById
    );

    // Update a Job_class with id
    router.put(
        "/:id",
        [
        authJwt.verifyToken,
        uploadFile.single("file"),
        ],
        schedule_mtc.update
    );

    app.use("/api/schedule_mtc", router);
};
