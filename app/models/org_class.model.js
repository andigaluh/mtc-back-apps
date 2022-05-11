module.exports = (sequelize, Sequelize) => {
  const Org_class = sequelize.define("org_class", {
    name: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Org_class;
};
