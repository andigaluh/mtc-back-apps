module.exports = (sequelize, Sequelize) => {
  const Machine_check = sequelize.define("machine_check", {
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
    },
    supervisor_approval: {
      type: Sequelize.BOOLEAN,
    },
    status_update_parts: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  });

  return Machine_check;
};
