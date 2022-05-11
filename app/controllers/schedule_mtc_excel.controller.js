const db = require("../models");
const fs = require("fs");
const Schedule_mtc_excel = db.schedule_mtc_excel;
const User = db.user;
const Op = db.Sequelize.Op;
const readXlsxFile = require("read-excel-file/node");
const Schedule_mtc = db.schedule_mtc;

exports.findAll = (req, res) => {
  const file_name = req.query.file_name;

  Schedule_mtc_excel.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving org_class.",
      });
    });
};

exports.uploadFiles = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    const uploaded = await Schedule_mtc_excel.create({
      user_id: req.body.user_id,
      file_name: req.file.filename,
    });

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let ScheduleMtcData = [];

      rows.forEach((row) => {
        let scheduleMtc_data = {
          machine_id: row[0],
          parts_id: row[1],
          user_id: row[2],
          area: row[3],
          activity: row[4],
          plan_date: row[5],
          photo_name: row[6],
          photo_date: row[7],
        };

        ScheduleMtcData.push(scheduleMtc_data);
      });

      Schedule_mtc.bulkCreate(ScheduleMtcData)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });

      /* return res.send({
        message: "Upload spareparts xls success.",
      }); */
    });
  } catch (error) {
    console.log(error);
    return res.send({ message: `Error when trying upload file: ${error}` });
  }
};

// Update a Job_class by the id in the request
/* exports.update = (req, res) => {
  const id = req.params.id;
  let data = {};

  if (req.file) {
    data = {
      title: req.body.title,
      description: req.body.description,
      expired_date: req.body.expired_date,
      status: req.body.status,
      file_name: req.file.filename,
    };

    Schedule_mtc_excel.findByPk(id, {
      attributes: ["file_name"],
    })
      .then((responseFile) => {
        if (responseFile) {
          fs.unlink(
            __basedir +
              "/resources/static/assets/uploads/" +
              responseFile.file_name,
            () => {}
          );
          console.log(
            `proses delExistingFile dari update ${responseFile.filename}`
          );
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            "Error deleting document inspection with id=" +
            id +
            "with error : " +
            err,
        });
      });
  } else {
    data = {
      title: req.body.title,
      description: req.body.description,
      expired_date: req.body.expired_date,
      status: req.body.status,
    };
  }

  Schedule_mtc_excel.update(data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update document inspection success",
        });
      } else {
        res.send({
          message: `Cannot update document inspection with id=${id}. Maybe document inspection was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating document inspection with id=" + id,
      });
    });
}; */

exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const splitUrl = req.url.split("/");

    const filename = await Schedule_mtc_excel.findByPk(id, {
      attributes: ["file_name"],
    });

    console.log(filename.file_name);

    if (filename) {
      const delExistingFile = fs.unlink(
        __basedir + "/resources/static/assets/uploads/" + filename.file_name,
        () => {}
      );
      console.log(`proses delExistingFile`);
    }

    const delSchedule_mtc_excel = Schedule_mtc_excel.destroy({
      where: { id: id },
    });
    console.log(`proses delSchedule_mtc_excel`);

    return res.status(200).send({
      message: "Delete spareparts excel success.",
    });
  } catch (error) {
    return res.status(500).send(`error occured ${error}`);
  }
};

// Find a single Job_class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Schedule_mtc_excel.findByPk(id, {
    includes: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Schedule_mtc_excel with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Schedule_mtc_excel with id=" + id,
      });
    });
};
