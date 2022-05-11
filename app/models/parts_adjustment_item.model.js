module.exports = (sequelize, Sequelize) => {
  const Parts_adjustment_item = sequelize.define("parts_adjustment_item", {
    qty: {
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.ENUM("addition", "subtraction"),
    },
    notes: {
      type: Sequelize.TEXT
    }
  });

  return Parts_adjustment_item;
};
