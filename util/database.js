const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "mysqlroot", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
