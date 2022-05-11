module.exports = (sequelize, Sequelize) => {
  const Parts_adjustment = sequelize.define("parts_adjustment", {
    date: {
      type: Sequelize.DATE,
    },
    notes: {
      type: Sequelize.TEXT,
    },
  });

  return Parts_adjustment;
};
