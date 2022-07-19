const { sequelize } = require("../models");
const db = require("../models");
const Machine_check = db.machine_check;
const Machine_check_condition = db.machine_check_condition;
const Machine_check_problem = db.machine_check_problem;
const Machine_check_need_parts = db.machine_check_need_parts;
const Parts = db.parts;
const Notif = db.notif;
const Machine_check_approval = db.machine_check_approval;
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Machine
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.date) {
    res.status(400).send({
      message: "Date can not be empty!",
    });
    return;
  }

  if (!req.body.time) {
    res.status(400).send({
      message: "Time can not be empty!",
    });
    return;
  }

  let findMachineCheckByDateShift = await Machine_check.findAll({
    where: {
      date: {
        [Op.eq]: new Date(req.body.date),
      },
      shift_id: {
        [Op.eq]: req.body.shift_id,
      },
      machine_id: {
        [Op.eq]: req.body.machine_id
      }
    },
  });
  
  if (findMachineCheckByDateShift.length > 0 ) {
    res.send({
      message: "Create machine check failed, MACHINE, DATE and SHIFT has been checked",
    });
  } else {
    const machine_check = {
      date: req.body.date,
      time: req.body.time,
      inspection_date: req.body.inspection_date,
      inspection_id: req.body.inspection_id,
      inspection_approval: req.body.inspection_approval,
      machine_id: req.body.machine_id,
      shift_id: req.body.shift_id,
      supervisor_id: req.body.supervisor_id
    };

    let createMachineCheck = await Machine_check.create(machine_check);
    try {
      let machine_check_conditions = req.body.status_parts;
      let machine_check_problems = req.body.problems;
      let machine_check_need_parts = req.body.need_parts;
      let supervisor_id = req.body.supervisor_id;

      if (machine_check_conditions.length > 0) {
        machine_check_conditions.map(async (values) => {
          let comment_value = values.comment_value ? values.comment_value : "" ;
          var data_parts = {
            machine_check_id: createMachineCheck.id,
            parts_id: values.parts_id,
            status: values.status,
            comment_value: comment_value,
          };

          const createMachineCheckCondition =
            await Machine_check_condition.create(data_parts);
        });
      }

      if (machine_check_problems.length > 0) {
        machine_check_problems.map(async (values) => {
          var data_problem = {
            machine_check_id: createMachineCheck.id,
            problem_cause: values.problem_cause,
            problem_action: values.problem_action,
            problem_status: values.problem_status,
          };

          const createMachineCheckProblems = await Machine_check_problem.create(
            data_problem
          );
        });
      }

      if (machine_check_need_parts.length > 0) {
        machine_check_need_parts.map(async (values) => {
          var data_need = {
            machine_check_id: createMachineCheck.id,
            parts_id: values.parts_id,
            qty: values.qty,
            type: values.type,
          };

          let createMachineCheckNeedParts =
            await Machine_check_need_parts.create(data_need);

          if (createMachineCheckNeedParts.type === "subtraction") {
            let findPartsByPk = await Parts.findByPk(
              createMachineCheckNeedParts.parts_id
            );
            let currentQty = findPartsByPk.qty;
            if (currentQty > 0) { 
              await Parts.update(
                { qty: currentQty - createMachineCheckNeedParts.qty },
                { where: { id: createMachineCheckNeedParts.parts_id } }
              );
            }
          }
        });
      }

      if (supervisor_id) {
        await Notif.create({
          user_id: supervisor_id,
          title: `Form check machine ${req.body.machine_name}, ${req.body.inspection_date} ${req.body.time}`,
          messages: `Form check machine ${req.body.machine_name} telah selesai dilakukan. silakan direview sebelum di approve`,
          is_read: false
        });
      }

      
      //sequelize.query("CALL cp_report_machine_check()").then((v) => {
        res.send({
          message: "Create machine check success",
        });
      //});
    } catch (error) {
      console.log(error);
    }
  }
};

exports.mgr_approval = (req, res) => {
  const id = req.params.id;

  Machine_check_approval.create({
    machine_check_id : id,
    userId : req.body.supervisor_id
  }).then((response) => {
    if (response) {
      res.send({
        message:
          "Create manager approval success.",
      });
    } else {
      res.send({
        message: "Create manager approval failed.",
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error manager approval machine-check with id=" + id,
    });
  });
}

exports.findAppr = (req, res) => {
  const machine_check_id = req.query.machine_check_id;
  var condition = machine_check_id ? { machine_check_id: { [Op.eq]: machine_check_id } } : null;

  Machine_check_approval.findAll({
    where: condition,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "username"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};
// Update a Machine by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Machine_check.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        //sequelize.query("CALL cp_report_machine_check()").then((v) => {
          res.send({
            message: "Approval machine-check success.",
          });
        //});
        
      } else {
        res.send({
          message: `Cannot update machine-check with id=${id}. Maybe machine-check was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating machine-check with id=" + id,
      });
    });
};

