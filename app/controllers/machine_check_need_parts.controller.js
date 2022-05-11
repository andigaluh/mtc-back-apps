const db = require("../models");
const Machine_check_need_parts = db.machine_check_need_parts;
const Parts = db.parts;
const Machine_parts = db.machine_parts;
const Op = db.Sequelize.Op;


// Retrieve all Machine from the database.
exports.findAllByParts = (req, res) => {
  const parts_id = req.params.id;

  Machine_check_need_parts.findAll({ where: {
      parts_id : {
          [Op.eq] : parts_id
      }
  }  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};
