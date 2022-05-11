const db = require("../models");
const Job_class = db.job_class;
const Op = db.Sequelize.Op;

// Create and Save a new Job_class
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Job_class
  const org_class = {
    name: req.body.name,
    status: req.body.status ? req.body.status : false,
    upper_job_class_id: req.body.upper_job_class_id,
  };

  // Save Job_class in the database
  Job_class.create(org_class)
    .then((data) => {
      res.send({
        message: "Create job class success."
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Job_class.",
      });
    });
};

// Retrieve all Job_class from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Job_class.findAll({
    where: condition,
    include: [
      {
        model: Job_class,
        as: "upper_job_class",
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

// Find a single Job_class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Job_class.findByPk(id,{
    include: [
      {
        model: Job_class,
        as: "upper_job_class",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Job_class with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Job_class with id=" + id,
      });
    });
};

// Update a Job_class by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Job_class.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update job class success",
        });
      } else {
        res.send({
          message: `Cannot update Job_class with id=${id}. Maybe Job_class was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Job_class with id=" + id,
      });
    });
};

// Delete a Job_class with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Job_class.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete job class success",
        });
      } else {
        res.send({
          message: `Cannot delete Job_class with id=${id}. Maybe Job_class was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Job_class with id=" + id,
      });
    });
};

// Delete all Job_class from the database.
exports.deleteAll = (req, res) => {
  Job_class.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `Delete ${nums} Job classes success` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all org_classes.",
      });
    });
};

// Find all published Job_class
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
