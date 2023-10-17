const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const UserOrder = sequelize.define("userOrder", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = UserOrder;
