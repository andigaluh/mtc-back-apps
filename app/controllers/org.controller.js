const db = require("../models");
const Org = db.org;
const Org_class = db.org_class;
const Op = db.Sequelize.Op;

// Create and Save a new Org
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Org
  const org_class = {
    name: req.body.name,
    status: req.body.status ? req.body.status : false,
    org_class_id: req.body.org_class_id,
  };

  // Save Org in the database
  Org.create(org_class)
    .then((data) => {
      res.send({
        message: "Create organization success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Org.",
      });
    });
};

// Retrieve all Org from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Org.findAll({ 
      where: condition,
      include: [{
            model: Org_class,
            as: "org_class",
            attributes: ["id", "name"]
        }],
       order: [['id', 'DESC']]
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

// Find a single Org with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Org.findByPk(id, {
    include: [
      {
        model: Org_class,
        as: "org_class",
        attributes: ["id", "name"],
      }
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Org with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Org with id=" + id + " error= " + err,
      });
    });
};

// Update a Org by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Org.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update organization success.",
        });
      } else {
        res.send({
          message: `Cannot update Org with id=${id}. Maybe Org was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Org with id=" + id,
      });
    });
};

// Delete a Org with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Org.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete organization success",
        });
      } else {
        res.send({
          message: `Cannot delete Org with id=${id}. Maybe Org was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Org with id=" + id,
      });
    });
};

// Delete all Org from the database.
exports.deleteAll = (req, res) => {
  Org.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `Delete ${nums} Orgs Success` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all org_classes.",
      });
    });
};

// Find all published Org
exports.findAllPublished = (req, res) => {
  Org.findAll({
    where: { status: true },
    include: [
      {
        model: Org_class,
        as: "org_class",
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
          err.message || "Some error occurred while retrieving org_classes.",
      });
    });
};
