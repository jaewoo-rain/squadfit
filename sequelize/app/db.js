const Sequelize = require("sequelize");

const sequelize = new Sequelize("squadfitTest", "root", "jaewoo", {
  host: "localhost",
  port: 3307,
  dialect: "mysql",
  logging: true, // 로깅 false하면 sql문 안보임
});

module.exports = sequelize;
