const db = require("../models");
const Parts_adjusment_item = db.parts_adjusment_item;
const Parts = db.parts;
const Op = db.Sequelize.Op;

// Create and Save a new Parts
exports.create = (req, res) => {
  // Validate request
  if (!req.body.qty) {
    res.status(400).send({
      message: "Qty can not be empty!",
    });
    return;
  }

  if (!req.body.notes) {
    res.status(400).send({
      message: "notes can not be empty!",
    });
    return;
  }

  // Create a Parts
  const parts = {
    notes: req.body.notes,
    type: req.body.type,
    qty: req.body.qty,
    parts_id: req.body.parts_id
  };

  // Save Parts in the database
  Parts_adjusment_item
    .create(parts)
    .then((data) => {
      Parts.findByPk(req.body.parts_id).then(
          (parts) => {
            let currentQty = parts.qty; 
              Parts.update(
                { qty: currentQty + parseInt(req.body.qty) },
                { where: { id: req.body.parts_id } }
              ).then(
                  (dataUpd) => {
                    res.send({
                      message: "Create parts-stock success.",
                    });
                  }
              );
            
          }
      );
      
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Parts.",
      });
    });
};

// Retrieve all Parts from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Parts_adjusment_item
    .findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving parts.",
      });
    });
};

// Retrieve all Parts from the database.
exports.findAllByParts = (req, res) => {
  const parts_id = req.params.id;
  

  Parts_adjusment_item
    .findAll({
      where: {
        parts_id: {
          [Op.eq]: parts_id,
        },
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving parts.",
      });
    });
};

// Find a single Parts with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Parts_adjusment_item
    .findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Parts with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Parts with id=" + id,
      });
    });
};

// Update a Parts by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Parts_adjusment_item
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update parts success.",
        });
      } else {
        res.send({
          message: `Cannot update Parts with id=${id}. Maybe Parts was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Parts with id=" + id,
      });
    });
};

// Delete a Parts with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Parts_adjusment_item
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete parts success.",
        });
      } else {
        res.send({
          message: `Cannot delete Parts with id=${id}. Maybe Parts was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Parts with id=" + id,
      });
    });
};

// Delete all Parts from the database.
exports.deleteAll = (req, res) => {
  Parts_adjusment_item
    .destroy({
      where: {},
      truncate: false,
    })
    .then((nums) => {
      res.send({ message: `${nums} Partss were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all parts.",
      });
    });
};

// Find all published Parts
exports.findAllPublished = (req, res) => {
  Parts_adjusment_item
    .findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving parts.",
      });
    });
};
