const db = require("../models");
const Equipment = db.equipment;
const Op = db.Sequelize.Op;
const excel = require("exceljs");

exports.download = (req, res) => {
  Equipment.findAll().then(async (data) => {
    let equipment_data = [];
    let no = 1;
    data.forEach((obj) => {
      equipment_data.push({
        no: no++,
        id: obj.id,
        name: obj.name,
        description: obj.description,
        standard: obj.standard,
        method: obj.method,
        expired_date: obj.expired_date,
        status: obj.status,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("spareparts");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Id", key: "id", width: 10 },
      { header: "Name", key: "name", width: 10 },
      { header: "Description", key: "description", width: 10 },
      { header: "Standard", key: "standard", width: 10 },
      { header: "Method", key: "method", width: 10 },
      { header: "Expired Date", key: "expired_date", width: 10 },
      { header: "Status", key: "status", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
      { header: "UpdatedAt", key: "updatedAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(equipment_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_equipment.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

// Create and Save a new Equipment
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  if (!req.body.method) {
    res.status(400).send({
      message: "method can not be empty!",
    });
    return;
  }

  if (!req.body.standard) {
    res.status(400).send({
      message: "standard can not be empty!",
    });
    return;
  }

  // Create a Equipment
  const equipment = {
    name: req.body.name,
    standard: req.body.standard,
    description: req.body.description,
    method: req.body.method,
    expired_date: req.body.expired_date,
    status: req.body.status ? req.body.status : false,
  };

  // Save Equipment in the database
  Equipment.create(equipment)
    .then((data) => {
      //res.send(data);
      res.send({
        message: "Create equipment success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Equipment.",
      });
    });
};

// Retrieve all Equipment from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (name) {
    condition.name = { [Op.like]: `%${name}%` };
  }

  if (start_date && end_date) {
    condition.expired_date = { [Op.gte]: start_date, [Op.lte]: end_date };
  } else if (start_date) {
    condition.expired_date = { [Op.gte]: start_date };
  }

  Equipment.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving equipment.",
      });
    });
};

// Find a single Equipment with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Equipment.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Equipment with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Equipment with id=" + id,
      });
    });
};

// Update a Equipment by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Equipment.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update equipment success.",
        });
      } else {
        res.send({
          message: `Cannot update Equipment with id=${id}. Maybe Equipment was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Equipment with id=" + id,
      });
    });
};

// Delete a Equipment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Equipment.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete equipment success.",
        });
      } else {
        res.send({
          message: `Cannot delete Equipment with id=${id}. Maybe Equipment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Equipment with id=" + id,
      });
    });
};

// Delete all Equipment from the database.
exports.deleteAll = (req, res) => {
  Equipment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Equipments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all equipment.",
      });
    });
};

// Find all published Equipment
exports.findAllPublished = (req, res) => {
  Equipment.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving equipment.",
      });
    });
};
