const db = require("../models");
const Shift = db.shift;
const Op = db.Sequelize.Op;

// Create and Save a new Shift
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Shift
  const shift = {
    name: req.body.name,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
  };

  // Save Shift in the database
  Shift.create(shift)
    .then((data) => {
      res.send({
        message: "Create shift success."
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Shift.",
      });
    });
};

// Retrieve all Shift from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Shift.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving shift.",
      });
    });
};

// Find a single Shift with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Shift.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Shift with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Shift with id=" + id,
      });
    });
};

// Update a Shift by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Shift.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update shift success.",
        });
      } else {
        res.send({
          message: `Cannot update Shift with id=${id}. Maybe Shift was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Shift with id=" + id,
      });
    });
};

// Delete a Shift with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Shift.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete shift success",
        });
      } else {
        res.send({
          message: `Cannot delete Shift with id=${id}. Maybe Shift was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Shift with id=" + id,
      });
    });
};

// Delete all Shift from the database.
exports.deleteAll = (req, res) => {
  Shift.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `Delete ${nums} Shift success` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all shiftes.",
      });
    });
};

// Find all published Shift
exports.findAllPublished = (req, res) => {
  Shift.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving shiftes.",
      });
    });
};
