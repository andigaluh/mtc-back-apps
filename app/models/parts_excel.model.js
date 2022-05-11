module.exports = (sequelize, Sequelize) => {
  const Parts_excel = sequelize.define(
    "parts_excel",
    {
      file_name: {
        type: Sequelize.STRING,
      }
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Parts_excel;
};
