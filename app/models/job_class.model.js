module.exports = (sequelize, Sequelize) => {
  const Job_class = sequelize.define("job_class", {
    name: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
    {
      initialAutoIncrement: 1000,
    });

  return Job_class;
};
