module.exports = (sequelize, Sequelize) => {
  const Doc_inspection = sequelize.define(
    "doc_inspection",
    {
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      file_name: {
        type: Sequelize.STRING,
      },
      expired_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Doc_inspection;
};
