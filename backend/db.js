const mysql = require("mysql2/promise");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const sqlDB = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

sqlDB
  .getConnection()
  .then(() => {
    console.warn("sqlDB connected !");
  })
  .catch(() => {
    console.warn(
      "warning:",
      "failed to get a DB connection.",
      "did you create a .env file with valid credentials?",
      "routes using models won't work as intended"
    );
  });

module.exports = {
  sqlDB,
};
