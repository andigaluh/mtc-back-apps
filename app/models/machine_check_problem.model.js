module.exports = (sequelize, Sequelize) => {
  const Machine_check_problem = sequelize.define("machine_check_problem", {
    problem_cause: {
      type: Sequelize.TEXT,
    },
    problem_image: {
      type: Sequelize.STRING,
    },
    problem_action: {
      type: Sequelize.STRING,
    },
    problem_status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  });

  return Machine_check_problem;
};
