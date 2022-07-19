const db = require("../models");
const Machine = db.machine;
const User = db.user;
const Problem_machine = db.problem_machine;
const Parts = db.parts;
const Parts_adjusment_item = db.parts_adjusment_item;
const Op = db.Sequelize.Op;
const excel = require("exceljs");
const fn = db.Sequelize.fn;
const col = db.Sequelize.col;
const literal = db.Sequelize.literal;

exports.download = (req, res) => {
  Problem_machine.findAll({
    include: [
      {
        model: Machine,
        as: "machine",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "name"],
      },
    ],
  }).then(async (data) => {
    let problem_data = [];
    let no = 1;
    data.forEach((obj) => {
      let start_problem_obj = new Date(obj.start_problem);
      let end_problem_obj = new Date(obj.end_problem);
      var diffMs = end_problem_obj - start_problem_obj;
      var diffDays = Math.floor(diffMs / 86400000); // days
      var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
      var diffProblem =
        diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes";

      problem_data.push({
        no: no++,
        id: obj.id,
        machine_name: obj.machine.name,
        parts_name: obj.parts.name,
        problem: obj.problem,
        counter_measure: obj.counter_measure,
        start_problem: obj.start_problem,
        end_problem: obj.end_problem,
        date_diff: diffProblem,
        status: obj.status,
        user: obj.user.name,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("problem_machine");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Id", key: "id", width: 10 },
      { header: "Machine Name", key: "machine_name", width: 10 },
      { header: "Parts", key: "parts_name", width: 10 },
      { header: "Problem", key: "problem", width: 10 },
      { header: "Counter Measure", key: "counter_measure", width: 10 },
      { header: "Start Problem", key: "start_problem", width: 10 },
      { header: "End Problem", key: "end_problem", width: 10 },
      { header: "Duration", key: "date_diff", width: 10 },
      { header: "Status", key: "status", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
      { header: "UpdatedAt", key: "updatedAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(problem_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_problem_machine.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

// Create and Save a new Machine
exports.create = (req, res) => {
  // Create a Machine
  const problem = {
    machine_id: req.body.machine_id,
    parts_id: req.body.parts_id,
    problem: req.body.problem,
    counter_measure: req.body.counter_measure,
    start_problem: req.body.start_problem,
    end_problem: req.body.end_problem,
    status: req.body.status,
    user_id: req.body.user_id,
  };

  // Save Machine in the database
  Problem_machine.create(problem)
    .then( async (data) => {
      

      let findPartsByPk = await Parts.findByPk(req.body.parts_id);
      let currentQty = findPartsByPk.qty;
      if (currentQty > 0) {
        await Parts.update(
          { qty: currentQty - 1 },
          { where: { id: req.body.parts_id } }
        );

        await Parts_adjusment_item.create({
          qty: 1,
          type: "subtraction",
          notes: "Stock taking from problem machine",
          parts_id: req.body.parts_id
        });
      }

      res.send({
        message: "Create problem machine success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the problem machine.",
      });
    });
};

// Retrieve all Machine from the database.
exports.findAll = (req, res) => {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (start_date && end_date) {
    condition.start_problem = { [Op.gte]: start_date };
    condition.end_problem = { [Op.lte]: end_date };
  } else if (start_date) {
    condition.start_problem = { [Op.gte]: start_date };
  }

  Problem_machine.findAll({
    where: condition,
    include: [
      {
        model: Machine,
        as: "machine",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "name", "expired_date"],
      },
    ],
  })
    .then((data) => {
      let toolsData = [];

      data.map((row) => {
        let dataRow = {
          id: row.id,
          machine: row.machine.name,
          parts: row.parts.name,
          parts_expired: row.parts.expired_date,
          parts_id: row.parts.id,
          user: row.user.name,
          problem: row.problem,
          counter_measure: row.counter_measure,
          start_problem: row.start_problem,
          end_problem: row.end_problem,
          createdAt: row.createdAt,
          status: row.status,
        };

        toolsData.push(dataRow);
      });

      res.send(toolsData);
      //res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving problem machine.",
      });
    });
};

// Find a single Job_class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Problem_machine.findByPk(id, {
    include: [
      {
        model: Machine,
        as: "machine",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find problem machine with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving problem machine with id=" + id,
      });
    });
};

// Update a Machine by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Problem_machine.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update problem machine success.",
        });
      } else {
        res.send({
          message: `Cannot update problem machine with id=${id}. Maybe problem machine was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating problem machine with id=" + id,
      });
    });
};

// Delete a Machine with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Problem_machine.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete problem machine success.",
        });
      } else {
        res.send({
          message: `Cannot delete problem machine with id=${id}. Maybe problem machine was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete problem machine with id=" + id,
      });
    });
};

// Delete all Machine from the database.
exports.deleteAll = (req, res) => {
  Problem_machine.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} problem machines were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all problem machines.",
      });
    });
};



