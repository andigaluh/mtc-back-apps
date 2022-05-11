module.exports = (sequelize, Sequelize) => {
  const Tools = sequelize.define(
    "tools",
    {
      name: {
        type: Sequelize.STRING,
      },
      qty: {
        type: Sequelize.INTEGER,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Tools;
};
