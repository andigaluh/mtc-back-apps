module.exports = (sequelize, Sequelize) => {
  const Equipment = sequelize.define(
    "equipment",
    {
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      standard: {
        type: Sequelize.STRING,
      },
      method: {
        type: Sequelize.STRING,
      },
      expired_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Equipment;
};
