const db = require("../models");
const Org_class = db.org_class;
const Op = db.Sequelize.Op;

// Create and Save a new Org_class
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
        message: "Name can not be empty!",
        });
        return;
    }

    // Create a Org_class
    const org_class = {
        name: req.body.name,
        status: req.body.status ? req.body.status : false,
    };

    // Save Org_class in the database
    Org_class.create(org_class)
        .then((data) => {
          res.send({
            message: "Create organization class success",
          });
        })
        .catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Org_class.",
        });
        });
};

// Retrieve all Org_class from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Org_class.findAll({ where: condition })
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

// Find a single Org_class with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Org_class.findByPk(id)
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Org_class with id=${id}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving Org_class with id=" + id,
        });
      });
};

// Update a Org_class by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Org_class.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Update organization class success.",
          });
        } else {
          res.send({
            message: `Cannot update Org_class with id=${id}. Maybe Org_class was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Org_class with id=" + id,
        });
      });
};

// Delete a Org_class with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Org_class.destroy({
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Delete organization class success",
          });
        } else {
          res.send({
            message: `Cannot delete Org_class with id=${id}. Maybe Org_class was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Org_class with id=" + id,
        });
      });
};

// Delete all Org_class from the database.
exports.deleteAll = (req, res) => {
    Org_class.destroy({
      where: {},
      truncate: false,
    })
      .then((nums) => {
        res.send({ message: `Delete ${nums} organization classes success` });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all org_classes.",
        });
      });
};

// Find all published Org_class
exports.findAllPublished = (req, res) => {
    Org_class.findAll({ where: { status: true } })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving org_classes.",
        });
      });
};
