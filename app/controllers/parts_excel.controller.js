const db = require("../models");
const fs = require("fs");
const Parts_excel = db.parts_excel;
const User = db.user;
const Op = db.Sequelize.Op;
const readXlsxFile = require("read-excel-file/node");
const Parts = db.parts;

exports.findAll = (req, res) => {
  const file_name = req.query.file_name;
  

  Parts_excel.findAll({
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

    const uploaded = await Parts_excel.create({
      user_id: req.body.user_id,
      file_name: req.file.filename,
    });

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let sparepartsData = [];

      rows.forEach((row) => {
        let parts_data = {
          name: row[0],
          description: row[1],
          standard: row[2],
          method: row[3],
          qty: row[4],
          expired_date: row[5],
          status: row[6],
        };

        sparepartsData.push(parts_data);
      });

      Parts.bulkCreate(sparepartsData)
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

    Parts_excel.findByPk(id, {
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

  Parts_excel.update(data, {
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

    const filename = await Parts_excel.findByPk(id, {
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

    const delParts_excel = Parts_excel.destroy({
      where: { id: id },
    });
    console.log(`proses delParts_excel`);

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

  Parts_excel.findByPk(id, {
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
          message: `Cannot find Parts_excel with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Parts_excel with id=" + id,
      });
    });
};
