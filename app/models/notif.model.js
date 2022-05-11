module.exports = (sequelize, Sequelize) => {
  const Notif = sequelize.define(
    "notif",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
      },
      messages: {
        type: Sequelize.TEXT,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Notif;
};
