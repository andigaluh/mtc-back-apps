const db = require("../models");
const fs = require("fs");
const Equipment_excel = db.equipment_excel;
const User = db.user;
const Op = db.Sequelize.Op;
const readXlsxFile = require("read-excel-file/node");
const Equipment = db.equipment;

exports.findAll = (req, res) => {
  const file_name = req.query.file_name;

  Equipment_excel.findAll({
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

    const uploaded = await Equipment_excel.create({
      user_id: req.body.user_id,
      file_name: req.file.filename,
    });

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let equipmentData = [];

      rows.forEach((row) => {
        let equipment_data = {
          name: row[0],
          description: row[1],
          standard: row[2],
          method: row[3],
          expired_date: row[4],
          status: row[5],
        };

        equipmentData.push(equipment_data);
      });

      Equipment.bulkCreate(equipmentData)
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



exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const splitUrl = req.url.split("/");

    const filename = await Equipment_excel.findByPk(id, {
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

    const delEquipment_excel = Equipment_excel.destroy({
      where: { id: id },
    });
    console.log(`proses delEquipment_excel`);

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

  Equipment_excel.findByPk(id, {
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
          message: `Cannot find Equipment_excel with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Equipment_excel with id=" + id,
      });
    });
};
