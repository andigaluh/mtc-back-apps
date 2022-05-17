const db = require("../models");
const Machine = db.machine;
const Machine_parts = db.machine_parts;
const Report_machine_check = db.report_machine_check;
const Machine_check_condition = db.machine_check_condition;
const Machine_check_problem = db.machine_check_problem;
const Machine_check_need_parts = db.machine_check_need_parts;
const User = db.user;
const Notif = db.notif;
const Parts = db.parts;
const Op = db.Sequelize.Op;
const excel = require("exceljs");
const literal = db.Sequelize.literal;
const fn = db.Sequelize.fn;

exports.download = (req, res) => {
  Report_machine_check.findAll().then( async (data) => {
    let report_machine_data = [];
    let no = 1;
    data.forEach((obj) => {
      report_machine_data.push({
        no: no++,
        machine_code: obj.machine_code,
        machine_name: obj.machine_name,
        date: obj.date,
        time: obj.time,
        inspection_date: obj.inspection_date,
        inspection_approval: obj.inspection_approval,
        supervisor_date: obj.supervisor_date,
        supervisor_approval: obj.supervisor_approval,
        shift_name: obj.shift_name,
        inspection_name: obj.inspection_name,
        supervisor_name: obj.supervisor_name,
        supervisor_username: obj.supervisor_username,
        jumlah_parts_ok: obj.jumlah_parts_ok,
        jumlah_parts_ng: obj.jumlah_parts_ng,
        total_parts: obj.total_parts,
        jumlah_problems: obj.jumlah_problems,
        jumlah_need_parts: obj.jumlah_need_parts,
        createdAt: obj.createdAt,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("report_machine");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Machine Code", key: "machine_code", width: 10 },
      { header: "Machine Name", key: "machine_name", width: 10 },
      { header: "Date", key: "date", width: 10 },
      { header: "Time", key: "time", width: 10 },
      { header: "Inspection Date", key: "inspection_date", width: 10 },
      { header: "Inspection Name", key: "inspection_name", width: 10 },
      { header: "Inspection Approval", key: "inspection_approval", width: 10 },
      { header: "Supervisor Date", key: "supervisor_date", width: 10 },
      { header: "Supervisor NIK", key: "supervisor_username", width: 10 },
      { header: "Supervisor Name", key: "supervisor_name", width: 10 },
      { header: "Supervisor Approval", key: "supervisor_approval", width: 10 },
      { header: "Shift", key: "shift_name", width: 10 },
      { header: "Jumlah Spareparts OK", key: "jumlah_parts_ok", width: 10 },
      { header: "Jumlah Spareparts NG", key: "jumlah_parts_ng", width: 10 },
      { header: "Total Spareparts", key: "total_parts", width: 10 },
      { header: "Jumlah Problems", key: "jumlah_problems", width: 10 },
      { header: "Jumlah Need Spareparts", key: "jumlah_need_parts", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(report_machine_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_report_machine_check.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

// Retrieve all Machine from the database.
exports.findAll = (req, res) => {
  const machine_name = req.query.title;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (machine_name) {
    condition.machine_name = { [Op.like]: `%${machine_name}%` };
  }

  if (start_date && end_date) {
    condition.date = { [Op.gte]: start_date, [Op.lte]: end_date };
  }else if (start_date) {
    condition.date = { [Op.gte]: start_date };
  }

  Report_machine_check.findAll({ 
      where: condition,
      order: [
          ['machine_check_id', 'DESC']
        ] 
    })
    .then((data) => {
      let arrayData = [];
      data.map((item) => {
        let status = true;
        status = (item.jumlah_problems && (item.jumlah_problems > 0)) ? false : true;
        arrayData.push({
          createdAt: item.createdAt,
          date: item.date,
          inspection_approval: item.inspection_approval,
          inspection_date: item.inspection_date,
          inspection_id: item.inspection_id,
          inspection_name: item.inspection_name,
          inspection_username: item.inspection_username,
          jumlah_need_parts: item.jumlah_need_parts,
          jumlah_parts_ng: item.jumlah_parts_ng,
          jumlah_parts_ok: item.jumlah_parts_ok,
          jumlah_problems: item.jumlah_problems,
          machine_check_id: item.machine_check_id,
          machine_code: item.machine_code,
          machine_id: item.machine_id,
          machine_name: item.machine_name,
          shift_id: item.shift_id,
          shift_name: item.shift_name,
          supervisor_approval: item.supervisor_approval,
          supervisor_date: item.supervisor_date,
          supervisor_id: item.supervisor_id,
          supervisor_name: item.supervisor_name,
          time: item.time,
          total_parts: item.total_parts,
          status: status
        })
      })
      //console.log(arrayData);
      res.send(arrayData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

// Find a single Machine with an id
exports.findOne = async (req, res) => {
  const machine_check_id = req.params.id;
  var MachineCheckConditionArr = [];
  var MachineCheckProblemArr = [];
  var MachineCheckNeedPartsArr = [];
  const ReportMachineCheck = await Report_machine_check.findByPk(machine_check_id);

  if(ReportMachineCheck) {
    
    const MachineCheckCondition = await Machine_check_condition.findAll({ 
        where : {
            machine_check_id: machine_check_id
        }, 
        include : [
            {
                model: Parts,
                as: "parts",
                attributes: ["name", "standard", "method"]
            }
        ]
    });

    if(MachineCheckCondition.length > 0) {
        MachineCheckCondition.map(valCondition => {
            MachineCheckConditionArr.push({
              parts_id: valCondition.parts_id,
              parts_name: valCondition.parts.name,
              parts_standard: valCondition.parts.standard,
              parts_method: valCondition.parts.method,
              status: valCondition.status,
              comment_value: valCondition.comment_value,
            });
        })
    }

    const MachineCheckProblem = await Machine_check_problem.findAll({
      where: {
        machine_check_id: machine_check_id,
      },
      attributes: ["problem_cause", "problem_action"]
    });

    if (MachineCheckProblem.length > 0) {
        MachineCheckProblem.map(valProblem => {
            MachineCheckProblemArr.push({
              problem_cause: valProblem.problem_cause,
              problem_action: valProblem.problem_action,
              problem_status: valProblem.problem_status,
            });
        })
    }

    const MachineCheckNeedParts = await Machine_check_need_parts.findAll({
      where: {
        machine_check_id: machine_check_id,
      },
        include : [
            {
                model: Parts,
                as: "parts",
                attributes: ["name"]
            }
        ]
    });

    if (MachineCheckNeedParts.length > 0) {
      MachineCheckNeedParts.map((valNeedParts) => {
        MachineCheckNeedPartsArr.push({
          parts_id: valNeedParts.parts_id,
          qty: valNeedParts.qty,
          type: valNeedParts.type,
          parts_name: valNeedParts.parts.name,
        });
      });
    }

      var data_resp = {
        machine_name: ReportMachineCheck.machine_name,
        inspection_name: ReportMachineCheck.inspection_name,
        shift_name: ReportMachineCheck.shift_name,
        date: ReportMachineCheck.date,
        time: ReportMachineCheck.time,
        supervisor_id: ReportMachineCheck.supervisor_id,
        supervisor_approval: ReportMachineCheck.supervisor_approval,
        MachineCheckConditionArr: MachineCheckConditionArr,
        MachineCheckProblemArr: MachineCheckProblemArr,
        MachineCheckNeedPartsArr: MachineCheckNeedPartsArr,
      };

    //console.log(JSON.stringify(data_resp,null,2));
    res.status(200).send(data_resp);

  } else {
      res.status(500).send({
          messages: "Failed retrieve machine check"
      })
  }

};

// Delete a Machine with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Machine.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete machine success.",
        });
      } else {
        res.send({
          message: `Cannot delete Machine with id=${id}. Maybe Machine was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Machine with id=" + id,
      });
    });
};

// Delete all Machine from the database.
exports.deleteAll = (req, res) => {
  Machine.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Machines were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all machines.",
      });
    });
};

exports.cronjobSummary = async (req, res) => {
  const machine_name = req.query.title;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};
  let result = [];
  let resultReport = [];
  let statusReport = false;
  let today = new Date(),
      month = "" + (today.getMonth() + 1),
      day = "" + today.getDate(),
      year = today.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

  let fullDate_today =  [year, month, day].join("-");

  if (machine_name) {
    condition.machine_name = { [Op.like]: `%${machine_name}%` };
  }

  if (start_date && end_date) {
    condition.date = { [Op.gte]: start_date, [Op.lte]: end_date };
  } else if (start_date) {
    condition.date = { [Op.gte]: start_date };
  }

  const dbMachine = await Machine.findAll({
    attributes: [
      [fn("DATE", today), "date"],
      ["id", "id"],
      ["code", "code"],
      ["name", "name"],
      [
        literal(
          "IF((select shift_id from report_machine_checks where report_machine_checks.machine_id = id and report_machine_checks.shift_id = 1 and DATE(date) = now()) >0, TRUE, FALSE)"
        ),
        "shift_pagi",
      ],
      [
        literal(
          "IF((select shift_id from report_machine_checks where report_machine_checks.machine_id = id and report_machine_checks.shift_id = 2 and DATE(date) = now()) >0, TRUE, FALSE)"
        ),
        "shift_sore",
      ],
      [
        literal(
          "IF((select shift_id from report_machine_checks where report_machine_checks.machine_id = id and report_machine_checks.shift_id = 3 and DATE(date) = now()) >0, TRUE, FALSE)"
        ),
        "shift_malam",
      ],
    ],
  });

  const receiverNotif = await User.findAll({
    where: {
      job_id : {
        [Op.gte] : 4
      }
    },
    attributes: [
      ["id", "id"],
      ["username", "username"],
      ["name","name"],
      ["email", "email"]
    ]
  });

  //let userReceiverNotifId = receiverNotif.id;

  let messagesNotif = "";

  messagesNotif = `Berikut rangkuman daily check hari ini tanggal ${fullDate_today} : \n ${JSON.stringify(dbMachine, 0, 2)}`;

  if (receiverNotif) {
    receiverNotif.map( async (user) => {
      await Notif.create({
        user_id: user.id,
        title: `Rangkuman daily check machine tanggal ${fullDate_today}`,
        messages: messagesNotif,
        is_read: false,
      });
    })
    
  }

  res.send({
    error: false,
    messages: "summary notification success",
  });

  /* Report_machine_check.findAll({
    where: condition,
    order: [["machine_check_id", "DESC"]],
  })
    .then((data) => {
      let arrayData = [];
      data.map((item) => {
        let status = true;
        status =
          item.jumlah_problems && item.jumlah_problems > 0 ? false : true;
        arrayData.push({
          createdAt: item.createdAt,
          date: item.date,
          inspection_approval: item.inspection_approval,
          inspection_date: item.inspection_date,
          inspection_id: item.inspection_id,
          inspection_name: item.inspection_name,
          inspection_username: item.inspection_username,
          jumlah_need_parts: item.jumlah_need_parts,
          jumlah_parts_ng: item.jumlah_parts_ng,
          jumlah_parts_ok: item.jumlah_parts_ok,
          jumlah_problems: item.jumlah_problems,
          machine_check_id: item.machine_check_id,
          machine_code: item.machine_code,
          machine_id: item.machine_id,
          machine_name: item.machine_name,
          shift_id: item.shift_id,
          shift_name: item.shift_name,
          supervisor_approval: item.supervisor_approval,
          supervisor_date: item.supervisor_date,
          supervisor_id: item.supervisor_id,
          supervisor_name: item.supervisor_name,
          time: item.time,
          total_parts: item.total_parts,
          status: status,
        });
      });
      console.log(arrayData);
      res.send(arrayData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    }); */
};