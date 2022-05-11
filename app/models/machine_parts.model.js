module.exports = (sequelize, Sequelize) => {
  const Machine_parts = sequelize.define("machine_parts", {
    machine_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    parts_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  });

  return Machine_parts;
};
