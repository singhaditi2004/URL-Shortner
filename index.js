const express = require("express");
const { Sequelize } = require("sequelize");
const urlRoute = require("./routes/url");
const app = express();
const PORT = 8080;

// MySQL connection setup using Sequelize
const sequelize = new Sequelize("url_shortener", "root", "Aditi@2004", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: false,
});

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Test MySQL connection
async function connectToMySQL() {
  try {
    // Try connecting to the database
    await sequelize.authenticate();
    console.log("MySQL connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Call the connect function to establish a connection
connectToMySQL();

// Sync the models (if you want to create tables based on your models)
sequelize
  .sync({ force: false }) // Set force: true to recreate tables on each restart (use with caution)
  .then(() => {
    console.log("Database & tables synced!");
  });

// Use the route to handle URL shortening requests
app.use("/url", urlRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
