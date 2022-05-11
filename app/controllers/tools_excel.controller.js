const db = require("../models");
const fs = require("fs");
const Tools_excel = db.tools_excel;
const User = db.user;
const Op = db.Sequelize.Op;
const readXlsxFile = require("read-excel-file/node");
const Tools = db.tools;

exports.findAll = (req, res) => {
  const file_name = req.query.file_name;

  Tools_excel.findAll({
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

    const uploaded = await Tools_excel.create({
      user_id: req.body.user_id,
      file_name: req.file.filename,
    });

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let toolsData = [];

      rows.forEach((row) => {
        let dataExcel = {
          name: row[0],
          qty: row[1],
          tools_type_id: row[2],
        };

        toolsData.push(dataExcel);
      });

      Tools.bulkCreate(toolsData)
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

    const filename = await Tools_excel.findByPk(id, {
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

    const delTools_excel = Tools_excel.destroy({
      where: { id: id },
    });
    console.log(`proses delTools_excel`);

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

  Tools_excel.findByPk(id, {
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
          message: `Cannot find Tools_excel with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tools_excel with id=" + id,
      });
    });
};
