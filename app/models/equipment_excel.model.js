module.exports = (sequelize, Sequelize) => {
  const Equipment_excel = sequelize.define(
    "equipment_excel",
    {
      file_name: {
        type: Sequelize.STRING,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Equipment_excel;
};
