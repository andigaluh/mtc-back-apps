module.exports = (sequelize, Sequelize) => {
  const Job = sequelize.define("jobs", {
    name: {
      type: Sequelize.STRING,
    },
    order_no: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Job;
};
