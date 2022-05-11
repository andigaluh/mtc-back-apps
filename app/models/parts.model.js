module.exports = (sequelize, Sequelize) => {
    const Parts = sequelize.define(
      "parts",
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
        qty: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        expired_date: {
          type: Sequelize.DATE,
          allowNull: true
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

    return Parts;
};
