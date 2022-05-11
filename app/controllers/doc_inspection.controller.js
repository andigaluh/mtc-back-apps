const db = require("../models");
const fs = require("fs");
const Doc_inspection = db.doc_inspection;
const Org_class = db.org_class;
const Op = db.Sequelize.Op;


/* exports.findAll = async (req, res) => {
  try {
    const findAll = await Doc_inspection.findAndCountAll({
      attributes: ["id", "title", "description", "file_name", "status", "createdAt"],
      order: [["id", "DESC"]],
    });
    
    return res.send(findAll);
  } catch (error) {
    return res.status(500).send(`error occured ${error}`);
  }
}; */

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Doc_inspection.findAll({
    where: condition,
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
    const splitUrl = req.url.split("/");

    const uploaded = await Doc_inspection.create({
      title: req.body.title,
      description: req.body.description,
      expired_date: req.body.expired_date,
      status: req.body.status,
      file_name: req.file.filename,
    });

    return res.send({
        message: "Create document inspection success."
    });
  } catch (error) {
    console.log(error);
    return res.send({message: `Error when trying upload images: ${error}`});
  }
};

// Update a Job_class by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  let data = {}

  if(req.file) {
    data = {
      title: req.body.title,
      description: req.body.description,
      expired_date: req.body.expired_date,
      status: req.body.status,
      file_name: req.file.filename,
    };

    Doc_inspection.findByPk(id, {
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

    Doc_inspection.update(data, {
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
};

exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const splitUrl = req.url.split("/");

    const filename = await Doc_inspection.findByPk(id, {
      attributes: ["file_name"],
    });

    console.log(filename.file_name);

    if (filename) {
      const delExistingFile = fs.unlink(
        __basedir +
          "/resources/static/assets/uploads/" +
          filename.file_name,
        () => {}
      );
      console.log(`proses delExistingFile`);
    }

    const delDoc_inspection = Doc_inspection.destroy({
      where: { id: id },
    });
    console.log(`proses delDoc_inspection`);

    return res.status(200).send({
        message: "Delete document inspection success."
    });
  } catch (error) {
    return res.status(500).send(`error occured ${error}`);
  }
};

// Find a single Job_class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Doc_inspection.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Doc_inspection with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Doc_inspection with id=" + id,
      });
    });
};
