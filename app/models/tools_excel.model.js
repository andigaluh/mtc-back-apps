module.exports = (sequelize, Sequelize) => {
  const Tools_excel = sequelize.define(
    "tools_excel",
    {
      file_name: {
        type: Sequelize.STRING,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Tools_excel;
};
