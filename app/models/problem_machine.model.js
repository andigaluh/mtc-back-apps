module.exports = (sequelize, Sequelize) => {
  const Problem_machine = sequelize.define(
    "problem_machine",
    {
      problem: {
        type: Sequelize.STRING,
      },
      counter_measure: {
        type: Sequelize.STRING,
      },
      start_problem: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_problem: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Problem_machine;
};
