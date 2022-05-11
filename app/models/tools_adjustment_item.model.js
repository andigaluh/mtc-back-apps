module.exports = (sequelize, Sequelize) => {
  const Tools_adjustment_item = sequelize.define(
    "tools_adjustment_item",
    {
      qty: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM("addition", "subtraction"),
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Tools_adjustment_item;
};
