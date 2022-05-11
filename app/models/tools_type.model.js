module.exports = (sequelize, Sequelize) => {
  const Tools_type = sequelize.define(
    "tools_type",
    {
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
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

  return Tools_type;
};
