module.exports = (sequelize, Sequelize) => {
  const Schedule_mtc_excel = sequelize.define(
    "schedule_mtc_excel",
    {
      file_name: {
        type: Sequelize.STRING,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Schedule_mtc_excel;
};
