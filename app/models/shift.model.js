module.exports = (sequelize, Sequelize) => {
  const Shift = sequelize.define("shift", {
    name: {
      type: Sequelize.STRING,
    },
    start_time: {
      type: Sequelize.TIME,
    },
    end_time: {
      type: Sequelize.TIME,
    },
  });

  return Shift;
};