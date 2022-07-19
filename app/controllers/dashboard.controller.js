const db = require("../models");
const Machine = db.machine;
const Machine_parts = db.machine_parts;
const Report_machine_check = db.report_machine_check;
const Machine_check_condition = db.machine_check_condition;
const Machine_check_problem = db.machine_check_problem;
const Machine_check_need_parts = db.machine_check_need_parts;
const Tools = db.tools;
const Parts = db.parts;
const Problem_machine = db.problem_machine;
const User = db.user;
const Shift = db.shift
const Op = db.Sequelize.Op;
const excel = require("exceljs");

const fn = db.Sequelize.fn;
const literal = db.Sequelize.literal;
const col = db.Sequelize.col;
const Where = db.Sequelize.where;

const dateToday = () => {
  var today = new Date(),
    month = "" + (today.getMonth() + 1),
    day = "" + today.getDate(),
    year = today.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");

} 


exports.findProblemDiffTime = (req, res) => {
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
    attributes: [
      ["id", "id"],
      ["problem", "problem"],
      ["counter_measure", "counter_measure"],
      ["status", "status"],
      ["createdAt", "createdAt"],
      ["start_problem", "start_problem"],
      ["end_problem", "end_problem"],
      [
        fn(
          "TIMESTAMPDIFF",
          literal("second"),
          col("start_problem"),
          col("end_problem")
        ),
        "second_diff",
      ],
    ],
    where: condition,
    include: [
      {
        model: Machine,
        as: "machine",
        attributes: ["name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["name"],
      },
    ],
  })
    .then((data) => {
      let toolsData = [];
      //console.log(data);
      data.map((row) => {
        
        let dataRow = {
          id: row.id,
          machine: row.machine.name,
          user: row.user.name,
          problem: row.problem,
          counter_measure: row.counter_measure,
          start_problem: row.start_problem,
          end_problem: row.end_problem,
          createdAt: row.createdAt,
          status: row.status,
          second_diff: row.second_diff,
        };

        toolsData.push(dataRow);
      });

      //res.send(toolsData);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving problem machine.",
      });
    });
};

exports.statusMachine = (req, res) => {
  Report_machine_check.findAll({
    attributes: [
      [fn("COUNT", col("machine_check_id")), "total_check"],
      [
        literal('( SELECT IF (jumlah_parts_ng > 0, "ng", "ok" ) )'),
        "status_machine",
      ],
      [fn("MONTHNAME", col("inspection_date")), "month"],
      [fn("YEAR", col("inspection_date")), "year"],
    ],
    group: [
      "status_machine",
      fn("YEAR", col("inspection_date")),
      fn("MONTH", col("inspection_date")),
    ],
    order: [
      [fn("MONTH", col("inspection_date")), "DESC"],
      [fn("YEAR", col("inspection_date"))],
    ],
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
      //res.send(resultData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.statusMachineNG = (req, res) => {
  Report_machine_check.findAll({
    attributes: [
      [fn("COUNT", col("machine_check_id")), "total_check"],
      [
        literal('( SELECT IF (jumlah_parts_ng > 0, "ng", "ok" ) )'),
        "status_machine",
      ],
      [fn("MONTHNAME", col("inspection_date")), "month"],
      [fn("YEAR", col("inspection_date")), "year"],
    ],
    where: [
      {
        jumlah_parts_ng: {
          [Op.gt]: 0,
        },
      },
    ],
    group: [
      "status_machine",
      fn("YEAR", col("inspection_date")),
      fn("MONTH", col("inspection_date")),
    ],
    order: [
      [fn("MONTH", col("inspection_date")), "DESC"],
      [fn("YEAR", col("inspection_date"))],
    ],
    limit: 2,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
      //res.send(resultData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    }); 
};

exports.statusMachineOK = (req, res) => {
  Report_machine_check.findAll({
    attributes: [
      [fn("COUNT", col("machine_check_id")), "total_check"],
      [
        literal('( SELECT IF (jumlah_parts_ng > 0, "ng", "ok" ) )'),
        "status_machine",
      ],
      [fn("MONTHNAME", col("inspection_date")), "month"],
      [fn("YEAR", col("inspection_date")), "year"],
    ],
    where: [
      {
        jumlah_parts_ng: {
          [Op.eq]: 0,
        },
      },
    ],
    group: [
      "status_machine",
      fn("YEAR", col("inspection_date")),
      fn("MONTH", col("inspection_date")),
    ],
    order: [
      [fn("MONTH", col("inspection_date")), "DESC"],
      [fn("YEAR", col("inspection_date"))],
    ],
    limit: 2,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
      //res.send(resultData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.statusMachineByMonthYear = async (req, res) => {
    now = new Date;
  Report_machine_check.findAll({
    attributes: [
      ["machine_check_id", "machine_check_id"],
      ["machine_code", "machine_code"],
      ["machine_name", "machine_name"],
      ["jumlah_parts_ok", "jumlah_parts_ok"],
      ["jumlah_parts_ng", "jumlah_parts_ng"],
      ["jumlah_problems", "jumlah_problems"],
      ["jumlah_need_parts", "jumlah_need_parts"],
      [fn("MONTHNAME", col("inspection_date")), "month"],
      [fn("YEAR", col("inspection_date")), "year"],
    ],
    where: {
      [Op.and]: [
        Where(fn("MONTH", col("inspection_date")), fn("month", now)),
        Where(fn("YEAR", col("inspection_date")), fn("year", now)),
      ],
      /* [Op.and]: [
        Where(fn("MONTH", col("inspection_date")), 11),
        Where(fn("YEAR", col("inspection_date")), 2021),
      ],  */
    },
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.statusMachineByNG = async (req, res) => {
  now = new Date();
  Report_machine_check.findAll({
    where: {
      [Op.and]: [
        Where(fn("MONTH", col("inspection_date")), fn("month", now)),
        Where(fn("YEAR", col("inspection_date")), fn("year", now)),
        {
            jumlah_parts_ng : {
                [Op.gt] : 0
            }
        }
      ],
      /* [Op.and]: [
        Where(fn("MONTH", col("inspection_date")), 11),
        Where(fn("YEAR", col("inspection_date")), 2021),
      ], */
    },
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};


exports.alertParts = async (req, res) => {
  now = new Date();
  Parts.findAll({
    where: {
      qty: {
        [Op.lt]: 5,
      },
    },
    limit: 5,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.alertTools = async (req, res) => {
  now = new Date();
  Tools.findAll({
    where: {
      qty: {
        [Op.lt]: 5,
      },
    },
    limit: 5,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.totalProblemMachine = (req, res) => {
  Machine.findAll({
    attributes: {
      include: [
        [
          literal(`(
                    SELECT COUNT(*)
                    FROM problem_machines AS problem_machines
                    WHERE problem_machines.machine_id = machine.id
                )`),
          "countProblem",
        ],
      ],
    },
  }).then((data) => {
    res.send(data);
  });

}

exports.totalProblemMachineInMonth = (req, res) => {
  let now = new Date;
  let thisMonth = now.getMonth() + 1;
  //console.log(thisMonth);
  Machine.findAll({
    attributes: {
      include: [
        [literal(`(SELECT MONTH(now()))`), "existing_month"],
        [literal(`(SELECT YEAR(now()))`), "existing_year"],
        [
          literal(`(
                    SELECT COUNT(*)
                    FROM problem_machines AS problem_machines
                    WHERE problem_machines.machine_id = machine.id
                    and month(start_problem) = month(now())
                )`),
          "countProblem",
        ],
      ],
    },
  }).then((data) => {
    res.send(data);
  });
};


exports.totalMinutesProblemMachine = (req, res) => {
  let now = new Date();
  let thisMonth = now.getMonth() + 1;
  //console.log(thisMonth)
  Machine.findAll({
    attributes: {
      include: [
        [
          literal(`(
                    SELECT SUM(TIMESTAMPDIFF( MINUTE, start_problem, end_problem ))
                    FROM problem_machines AS problem_machines
                    WHERE problem_machines.machine_id = machine.id
                )`),
          "total_minutes_problem",
        ],
      ],
    },
  }).then((data) => {
    res.send(data);
  });
};

exports.MachineTroubleTrending = (req, res) => {
  Problem_machine.findAll({
    attributes: [
      [fn("COUNT", col("id")), "total_problem"],
      [fn("MONTHNAME", col("start_problem")), "month"],
      [fn("YEAR", col("start_problem")), "year"],
    ],
    group: [
      fn("YEAR", col("start_problem")),
      fn("MONTH", col("start_problem")),
    ],
    order: [
      [fn("MONTH", col("start_problem")), "ASC"],
      [fn("YEAR", col("start_problem"))],
    ],
    limit: 12,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving problem machine.",
      });
    });
};

exports.DownTimeProblemMachineThisMonth = (req, res) => {
  let now = new Date();
  //let thisMonth = now.getMonth();
  let thisMonth = now.getMonth() + 1;
  //console.log(thisMonth);
  Machine.findAll({
    attributes: {
      include: [
        [
          literal(`(
                    SELECT SUM(TIMESTAMPDIFF( MINUTE, start_problem, end_problem ))
                    FROM problem_machines AS problem_machines
                    WHERE problem_machines.machine_id = machine.id
                    AND MONTH(problem_machines.start_problem) = ${thisMonth}
                )`),
          "total_minutes_problem",
        ],
      ],
    },
  }).then((data) => {
    //console.log(data)
    res.send(data);
  });
};

exports.TopFiveMachineProblem = (req, res) => {
  Problem_machine.findAll({
    attributes: [
      [fn("COUNT", col("id")), "total_problem"],
      ["machine_id", "machine_id"],
      [
        literal(`(
                    SELECT name
                    FROM machines AS machines
                    WHERE machines.id = machine_id
                )`),
        "machine_name",
      ],
    ],
    group: [["machine_id"]],
    order: [[fn("COUNT", col("id")), "DESC"]],
    limit: 5,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving problem machine.",
      });
    });
}

exports.TotalMachineCheck = async (req, res) => {
  const today = dateToday();
  const startDate = `${today} 00:00:00`;
  const endDate = `${today} 23:59:59`;
  const countMachine = await Machine.count();
  const countShift = await Shift.count();
  const totalMachineCheckInDay = Math.floor(countMachine * countShift);
  const totalFinishMachineCheckInDay = await Report_machine_check.count({
    where: {
      inspection_date: {
        [Op.between]: [startDate, endDate],
      },
    },
  });
  const totalUnFinishMachineCheckInDay = Math.floor(totalMachineCheckInDay - totalFinishMachineCheckInDay);
  res.send({
    today,
    countMachine,
    countShift,
    totalMachineCheckInDay,
    totalFinishMachineCheckInDay,
    totalUnFinishMachineCheckInDay,
  });
  //console.log(today)
}
