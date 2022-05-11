const db = require("../models");
const Job = db.job;
const Job_class = db.job_class;
const Org = db.org;
const Op = db.Sequelize.Op;

// Create and Save a new Job
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Job
  const job = {
    name: req.body.name,
    status: req.body.status ? req.body.status : false,
    job_class_id: req.body.job_class_id,
    org_id: req.body.org_id,
    order_no: req.body.order_no,
  };

  // Save Job in the database
  Job.create(job)
    .then((data) => {
      res.send({
        message: "Create job success"
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Job.",
      });
    });
};

// Retrieve all Job from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Job.findAll({
    where: condition,
    include: [
      {
        model: Job_class,
        as: "job_class",
        attributes: ["id", "name"],
      },
      {
        model: Org,
        as: "org",
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving job_class.",
      });
    });
};

// Find a single Job with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Job.findByPk(id, {
    include: [
      {
        model: Job_class,
        as: "job_class",
        attributes: ["id", "name"],
      },
      {
        model: Org,
        as: "org",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Job with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Job with id=" + id,
      });
    });
};

// Update a Job by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Job.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update job success.",
        });
      } else {
        res.send({
          message: `Cannot update Job with id=${id}. Maybe Job was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Job with id=" + id,
      });
    });
};

// Delete a Job with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Job.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete job success",
        });
      } else {
        res.send({
          message: `Cannot delete Job with id=${id}. Maybe Job was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Job with id=" + id,
      });
    });
};

// Delete all Job from the database.
exports.deleteAll = (req, res) => {
  Job.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `Delete ${nums} Jobs success` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all job_classes.",
      });
    });
};

// Find all published Job
exports.findAllPublished = (req, res) => {
  Job.findAll({
    where: { status: true },
    include: [
      {
        model: Job_class,
        as: "job_class",
        attributes: ["id", "name"],
      },
      {
        model: Org,
        as: "org",
        attributes: ["id", "name"],
      },
    ],
    order: [["name", "ASC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving job_classes.",
      });
    });
};
