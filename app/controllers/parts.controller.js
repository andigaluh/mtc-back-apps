const db = require("../models");
const Parts = db.parts;
const Op = db.Sequelize.Op;
const excel = require("exceljs");

exports.download = (req, res) => {
  Parts.findAll().then(async (data) => {
    let spareparts_data = [];
    let no = 1;
    data.forEach((obj) => {
      spareparts_data.push({
        no: no++,
        id:obj.id,
        name:obj.name,
        description:obj.description,
        standard:obj.standard,
        method:obj.method,
        qty:obj.qty,
        expired_date:obj.expired_date,
        status:obj.status,
        treatment:obj.treatment,
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
      { header: "Qty", key: "qty", width: 10 },
      { header: "Expired Date", key: "expired_date", width: 10 },
      { header: "Status", key: "status", width: 10 },
      { header: "Treatment", key: "treatment", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
      { header: "UpdatedAt", key: "updatedAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(spareparts_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_spareparts.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

// Create and Save a new Parts
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

  // Create a Parts
  const parts = {
    name: req.body.name,
    standard: req.body.standard,
    description: req.body.description,
    method: req.body.method,
    qty: req.body.qty,
    expired_date: req.body.expired_date,
    status: req.body.status ? req.body.status : false,
    treatment: req.body.treatment,
  };

  // Save Parts in the database
  Parts.create(parts)
    .then((data) => {
      //res.send(data);
      res.send({
        message: "Create parts success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Parts.",
      });
    });
};

// Retrieve all Parts from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {}

  if(name) {
    condition.name = { [Op.like]: `%${name}%` };
  }

  if (start_date && end_date) {
    condition.expired_date = { [Op.gte]: start_date, [Op.lte]: end_date };
  } else if (start_date) {
    condition.expired_date = { [Op.gte]: start_date };
  }
  
  Parts.findAll({ where: condition, order: [['id', 'DESC']] })
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

  Parts.findByPk(id)
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

  Parts.update(req.body, {
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

  Parts.destroy({
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
  Parts.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Parts were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all parts.",
      });
    });
};

// Find all published Parts
exports.findAllPublished = (req, res) => {
  Parts.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving parts.",
      });
    });
};
