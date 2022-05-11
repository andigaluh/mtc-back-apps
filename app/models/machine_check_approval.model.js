module.exports = (sequelize, Sequelize) => {
  const Machine_check_approval = sequelize.define("machine_check_approval", {
    machine_check_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  });

  return Machine_check_approval;
};
