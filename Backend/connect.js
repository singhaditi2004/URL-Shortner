// File: connect.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("url_shortener", "root", "Aditi@2004", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: console.log,
});

async function connectToMySQL() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = { sequelize, connectToMySQL };
