const db = require("../models");
const fs = require("fs");
const Schedule_mtc = db.schedule_mtc;
const Machine = db.machine;
const Parts = db.parts;
const User = db.user;
const Op = db.Sequelize.Op;
const excel = require("exceljs");

exports.download = (req, res) => {
  Schedule_mtc.findAll({
    include: [
      {
        model: Machine,
        as: "machine",
        attributes: ["id", "name"],
      },
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  }).then(async (data) => {
    let schedule_data = [];
    let no = 1;
    data.forEach((obj) => {
      schedule_data.push({
        no: no++,
        id: obj.id,
        machine_name: obj.machine.name,
        spareparts: obj.parts.name,
        user: obj.user.name,
        area: obj.area,
        activity: obj.activity,
        plan_date: obj.plan_date,
        photo_name: obj.photo_name,
        photo_date: obj.photo_date,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Schedule Maintenance");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Id", key: "id", width: 10 },
      { header: "Machine Name", key: "machine_name", width: 10 },
      { header: "Spareparts", key: "spareparts", width: 10 },
      { header: "User", key: "user", width: 10 },
      { header: "Area", key: "area", width: 10 },
      { header: "Activity", key: "activity", width: 10 },
      { header: "Plan Date", key: "plan_date", width: 10 },
      { header: "Photo Name", key: "photo_name", width: 10 },
      { header: "Photo Date", key: "photo_date", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
      { header: "UpdatedAt", key: "updatedAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(schedule_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_schedule_mtc.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

exports.download_template = (req, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Schedule Maintenance");

  worksheet.columns = [
    { header: "Machine ID", key: "machine_name", width: 10 },
    { header: "Spareparts ID", key: "spareparts", width: 10 },
    { header: "User ID", key: "user", width: 10 },
    { header: "Area", key: "area", width: 10 },
    { header: "Activity", key: "activity", width: 10 },
    { header: "Plan Date (mm/dd/yyyy)", key: "plan_date", width: 10 },
    { header: "Photo Name", key: "photo_name", width: 10 },
    { header: "Photo Date", key: "photo_date", width: 10 },
  ];

  // Add Array Rows
  //worksheet.addRows();
  
  Machine.findAll().then(async (data) => { 
    let machine_data = [];
    data.forEach((obj) => {
      machine_data.push({
        id: obj.id,
        machine_name: obj.name,
      });
    });
    let worksheet_machine = workbook.addWorksheet("Machines");

    worksheet_machine.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Machine Name", key: "machine_name", width: 10 },
    ];

    // Add Array Rows
    worksheet_machine.addRows(machine_data);

    Parts.findAll().then(async (data) => {
      let parts_data = [];
      data.forEach((obj) => {
        parts_data.push({
          id: obj.id,
          parts_name: obj.name,
        });
      });
      let worksheet_parts = workbook.addWorksheet("Spareparts");

      worksheet_parts.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Spareparts Name", key: "parts_name", width: 10 },
      ];

      // Add Array Rows
      worksheet_parts.addRows(parts_data);

      User.findAll().then(async (data) => {
        let user_data = [];
        data.forEach((obj) => {
          user_data.push({
            id: obj.id,
            name: obj.name,
          });
        });
        let worksheet_user = workbook.addWorksheet("User");

        worksheet_user.columns = [
          { header: "ID", key: "id", width: 10 },
          { header: "Name", key: "name", width: 10 },
        ];

        // Add Array Rows
        worksheet_user.addRows(user_data);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + Date.now() + "_schedule_mtc_template.xlsx"
        );

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      })
    })
  })
};

exports.findAll = (req, res) => {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (start_date && end_date) {
    condition.plan_date = { [Op.gte]: start_date };
    condition.plan_date = { [Op.lte]: end_date };
  } else if (start_date) {
    condition.plan_date = { [Op.gte]: start_date };
  }

  Schedule_mtc.findAll({
    where: condition,
    include: [
      {
        model: Machine,
        as: "machine",
        attributes: ["id", "name"],
      },
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      let toolsData = [];

      data.map((row) => {
        //console.log(row.user);
        let dataRow = {
          id: row.id,
          machine: row.machine.name,
          spareparts: row.parts.name,
          area: row.area,
          activity: row.activity,
          plan_date: row.plan_date,
          createdAt: row.createdAt,
          photo_date: row.photo_date,
          photo_name: row.photo_name,
          user: row.user.name
        };

        toolsData.push(dataRow);
      });

      res.send(toolsData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving schedule maintenance.",
      });
    });
};

exports.create = async (req, res) => {
  try {
    const splitUrl = req.url.split("/");

    const uploaded = await Schedule_mtc.create({
      area: req.body.area,
      activity: req.body.activity,
      plan_date: req.body.plan_date,
      machine_id: req.body.machine_id,
      parts_id: req.body.parts_id,
      user_id: req.body.user_id
      //photo_name: req.file.filename,
      //photo_date: req.body.photo_date,
    });

    return res.send({
      message: "Create schedule maintenance success.",
    });
  } catch (error) {
    console.log(error);
    return res.send({ message: `Error when trying upload images: ${error}` });
  }
};

// Update a Job_class by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  let data = {};
  let dateNow = new Date();

  /* if (req.file) {
    data = {
      area: req.body.area,
      activity: req.body.activity,
      plan_date: req.body.plan_date,
      machine_id: req.body.machine_id,
      parts_id: req.body.parts_id,
      photo_name: req.file.filename,
      photo_date: dateNow,
      user_id: req.body.user_id
    };

    Schedule_mtc.findByPk(id, {
      attributes: ["photo_name"],
    })
      .then((responseFile) => {
        if (responseFile) {
          fs.unlink(
            __basedir +
              "/resources/static/assets/uploads/" +
              responseFile.photo_name,
            () => {}
          );
          console.log(
            `proses delExistingFile dari update ${responseFile.filename}`
          );
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            "Error deleting schedule maintenance with id=" +
            id +
            "with error : " +
            err,
        });
      });
  } else {
    data = {
      area: req.body.area,
      activity: req.body.activity,
      plan_date: req.body.plan_date,
      machine_id: req.body.machine_id,
      parts_id: req.body.parts_id,
      user_id: req.body.user_id,
      photo_name: req.body.photo_name,
      photo_date: dateNow,
    };
  } */

  if (req.body.photo_name) {
    data = {
      area: req.body.area,
      activity: req.body.activity,
      plan_date: req.body.plan_date,
      machine_id: req.body.machine_id,
      parts_id: req.body.parts_id,
      user_id: req.body.user_id,
      photo_name: req.body.photo_name,
      photo_date: dateNow,
    };
  } else {
    data = {
      area: req.body.area,
      activity: req.body.activity,
      plan_date: req.body.plan_date,
      machine_id: req.body.machine_id,
      parts_id: req.body.parts_id,
      user_id: req.body.user_id,
    };
  }

  Schedule_mtc.update(data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update schedule maintenance success",
        });
      } else {
        res.send({
          message: `Cannot update schedule maintenance with id=${id}. Maybe schedule maintenance was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating schedule maintenance with id=" + id,
      });
    });
};

exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const splitUrl = req.url.split("/");

    const filename = await Schedule_mtc.findByPk(id, {
      attributes: ["photo_name"],
    });

    console.log(filename.photo_name);

    if (filename) {
      const delExistingFile = fs.unlink(
        __basedir + "/resources/static/assets/uploads/" + filename.photo_name,
        () => {}
      );
      console.log(`proses delExistingFile`);
    }

    const delSchedule_mtc = Schedule_mtc.destroy({
      where: { id: id },
    });
    console.log(`proses delSchedule_mtc`);

    return res.status(200).send({
      message: "Delete schedule maintenance success.",
    });
  } catch (error) {
    return res.status(500).send(`error occured ${error}`);
  }
};

// Find a single Job_class with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Schedule_mtc.findByPk(id, {
    include: [
      {
        model: Machine,
        as: "machine",
        attributes: ["id", "name"],
      },
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Schedule_mtc with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Schedule_mtc with id=" + id,
      });
    });
};
