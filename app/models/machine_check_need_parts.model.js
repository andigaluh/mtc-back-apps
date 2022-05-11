module.exports = (sequelize, Sequelize) => {
  const Machine_check_need_parts = sequelize.define(
    "machine_check_need_parts",
    {
      qty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      type: {
        type: Sequelize.ENUM("addition", "subtraction"),
      },
    }
  );

  return Machine_check_need_parts;
};
