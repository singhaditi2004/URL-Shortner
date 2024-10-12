const express = require("express");
const { connectToMySQL } = require("./connect");
const app = express();
const urlRoute = require("./routes/url");
const PORT = 8080;

// Middleware to parse JSON bodies (since you'll be receiving URL data in JSON)
app.use(express.json());

// Connect to MySQL instead of MongoDB
connectToMySQL();

// Routes
app.use("/url", urlRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
