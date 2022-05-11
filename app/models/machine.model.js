module.exports = (sequelize, Sequelize) => {
  const Machine = sequelize.define("machine", {
    code: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    location: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Machine;
};
