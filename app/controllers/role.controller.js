const db = require("../models");
const role = db.role;

const Op = db.Sequelize.Op;

// Create and Save a new role
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "name can not be empty!",
    });
    return;
  }

  // Create a role
  const roles = {
    name: req.body.name,
  };

  // Save role in the database
  role.create(roles)
    .then((data) => {
      res.send({
        message: "Create role success"
      });
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while creating the role.",
      });
    });
};

// Update and save an role
exports.update = (req, res) => {
  const id = req.params.id;

  role
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "update role success",
        });
      } else {
        res.send({
          message: `Cannot update role with id=${id}. Maybe role was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating role with id=" + id,
      });
    });
};

// Read role by id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  role
    .findByPk(id, {
      attributes: ["id", "name"],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error retrieving role with id=" + id,
      });
    });
};

// Read all roles
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  role
    .findAll({
      where: condition,
      attributes: ["id", "name"],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving roles.",
      });
    });
};

// Delete role by id
exports.delete = (req, res) => {
  const id = req.params.id;

  role
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete role success",
        });
      } else {
        res.send({
          message: `Cannot delete role with id=${id}. Maybe role was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete role with id=" + id,
      });
    });
};
