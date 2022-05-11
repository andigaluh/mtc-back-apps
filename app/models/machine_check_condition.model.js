module.exports = (sequelize, Sequelize) => {
  const Machine_check_condition = sequelize.define("machine_check_condition", {
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  });

  return Machine_check_condition;
};
