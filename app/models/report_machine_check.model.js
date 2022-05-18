module.exports = (sequelize, Sequelize) => {
  const Report_machine_check = sequelize.define("report_machine_check", {
    machine_check_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    machine_id: {
      type: Sequelize.INTEGER,
    },
    shift_id: {
      type: Sequelize.INTEGER,
    },
    inspection_id: {
      type: Sequelize.INTEGER,
    },
    supervisor_id: {
      type: Sequelize.INTEGER,
    },
    machine_code: {
      type: Sequelize.STRING,
    },
    machine_name: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    time: {
      type: Sequelize.TIME,
    },
    inspection_date: {
      type: Sequelize.DATE,
    },
    inspection_approval: {
      type: Sequelize.BOOLEAN,
    },
    supervisor_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    supervisor_approval: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    shift_name: {
      type: Sequelize.STRING,
    },
    inspection_name: {
      type: Sequelize.STRING,
    },
    inspection_username: {
      type: Sequelize.STRING,
    },
    supervisor_name: {
      type: Sequelize.STRING,
    },
    supervisor_username: {
      type: Sequelize.STRING,
    },
    jumlah_parts_ok: {
      type: Sequelize.INTEGER,
    },
    jumlah_parts_ng: {
      type: Sequelize.INTEGER,
    },
    total_parts: {
      type: Sequelize.INTEGER,
    },
    jumlah_problems: {
      type: Sequelize.INTEGER,
    },
    jumlah_need_parts: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.BOOLEAN,
    },
    status_update_parts: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Report_machine_check;
};
