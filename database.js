const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3307,
  database: "squadfit",
  password: "jaewoo",
  waitForConnections: true,
  connectionLimit: 10, // 동시에 최대 10개 연결 유지
});

module.exports = pool;
