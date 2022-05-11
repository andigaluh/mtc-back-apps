module.exports = (sequelize, Sequelize) => {
  const Tools_adjustment = sequelize.define(
    "tools_adjustment",
    {
      date: {
        type: Sequelize.DATE,
      },
      notes: {
        type: Sequelize.TEXT,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Tools_adjustment;
};
