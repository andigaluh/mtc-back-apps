const db = require("../models");
const Tools_type = db.tools_type;
const Op = db.Sequelize.Op;

// Create and Save a new Tools_type
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Tools_type
  const tools_type = {
    name: req.body.name,
    description: req.body.description,
    status: req.body.status ? req.body.status : false,
  };

  // Save Tools_type in the database
  Tools_type.create(tools_type)
    .then((data) => {
      //res.send(data);
      res.send({
        message: "Create tools type success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tools_type.",
      });
    });
};

// Retrieve all Tools_type from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Tools_type.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tools_type.",
      });
    });
};

// Find a single Tools_type with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tools_type.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tools_type with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tools_type with id=" + id,
      });
    });
};

// Update a Tools_type by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tools_type.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tools_type was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Tools_type with id=${id}. Maybe Tools_type was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tools_type with id=" + id,
      });
    });
};

// Delete a Tools_type with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tools_type.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tools_type was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tools_type with id=${id}. Maybe Tools_type was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tools_type with id=" + id,
      });
    });
};

// Delete all Tools_type from the database.
exports.deleteAll = (req, res) => {
  Tools_type.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Tools_typees were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tools_typees.",
      });
    });
};

// Find all published Tools_type
exports.findAllPublished = (req, res) => {
  Tools_type.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tools_typees.",
      });
    });
};
