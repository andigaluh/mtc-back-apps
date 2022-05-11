module.exports = (sequelize, Sequelize) => {
  const Org = sequelize.define("org", {
    name: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Org;
};
