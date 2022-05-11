const db = require("../models");
const Tools_adjustment_item = db.tools_adjustment_item;
const Tools = db.tools;
const User = db.user
const Op = db.Sequelize.Op;
const excel = require("exceljs");

exports.download = (req, res) => {
  const tools_id = req.params.id;
  let condition = {};
  condition.tools_id = { [Op.eq]: tools_id };

  Tools_adjustment_item.findAll({
    where: condition,
    include: [
      {
        model: Tools,
        as: "tools",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "DESC"]],
  }).then(async (data) => {
    let tools_adj = [];
    let no = 1;
    data.forEach((obj) => {
      tools_adj.push({
        no: no++,
        id: obj.id,
        tools_name: obj.tools.name,
        type: obj.type,
        qty: obj.qty,
        user: obj.user.name,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("report_machine");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Id", key: "id", width: 10 },
      { header: "Tools Name", key: "tools_name", width: 10 },
      { header: "Type", key: "type", width: 10 },
      { header: "qty", key: "qty", width: 10 },
      { header: "User", key: "user", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
      { header: "UpdatedAt", key: "updatedAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(tools_adj);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_" + tools_id + "_tools_adjustment.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

// Create and Save a new Tools
exports.create = (req, res) => {
  // Validate request
  const type = req.body.type;
  const qty = req.body.qty;
  const tools_id = req.body.tools_id;
  const user_id = req.body.user_id;
  if (!req.body.qty) {
    res.status(400).send({
      message: "Qty can not be empty!",
    });
    return;
  }

  // Create a Tools
  const tools = {
    type,
    qty,
    tools_id,
    user_id,
  };

  // Save Tools in the database
  Tools_adjustment_item.create(tools)
    .then((data) => {
      Tools.findByPk(req.body.tools_id).then((tools) => {
        let currentQty = tools.qty;
        if (type == "addition") {
          Tools.update(
            { qty: currentQty + parseInt(req.body.qty) },
            { where: { id: req.body.tools_id } }
          ).then((dataUpd) => {
            res.send({
              message: "Create tools-stock success.",
            });
          });
        } else {
          Tools.update(
            { qty: currentQty - parseInt(req.body.qty) },
            { where: { id: req.body.tools_id } }
          ).then((dataUpd) => {
            res.send({
              message: "Create tools-stock success.",
            });
          });
        }
          
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Tools.",
      });
    });
};

// Retrieve all Tools from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Tools_adjustment_item.findAll({
    where: condition,
    include: [
      {
        model: Tools,
        as: "tools",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
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
        message: err.message || "Some error occurred while retrieving tools.",
      });
    });
};

// Retrieve all Tools from the database.
exports.findAllByTools = (req, res) => {
  const tools_id = req.params.id;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  condition.tools_id = { [Op.eq]: tools_id };

  if (start_date && end_date) {
    condition.createdAt = { [Op.gte]: start_date, [Op.lte]: end_date };
  } else if (start_date) {
    condition.createdAt = { [Op.gte]: start_date };
  }

  Tools_adjustment_item.findAll({
    where: condition,
    include: [
      {
        model: Tools,
        as: "tools",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
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
        message: err.message || "Some error occurred while retrieving tools.",
      });
    });
};

// Find a single Tools with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tools_adjustment_item.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tools with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tools with id=" + id,
      });
    });
};

// Update a Tools by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tools_adjustment_item.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update tools success.",
        });
      } else {
        res.send({
          message: `Cannot update Tools with id=${id}. Maybe Tools was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tools with id=" + id,
      });
    });
};

// Delete a Tools with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tools_adjustment_item.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete tools success.",
        });
      } else {
        res.send({
          message: `Cannot delete Tools with id=${id}. Maybe Tools was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tools with id=" + id,
      });
    });
};

// Delete all Tools from the database.
exports.deleteAll = (req, res) => {
  Tools_adjustment_item.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Toolss were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all tools.",
      });
    });
};

// Find all published Tools
exports.findAllPublished = (req, res) => {
  Tools_adjustment_item.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tools.",
      });
    });
};
