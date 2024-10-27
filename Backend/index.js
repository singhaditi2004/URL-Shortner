const express = require("express");
const { sequelize, connectToMySQL } = require("./connect");
const urlRoute = require("./routes/url");
const app = express();
const path = require("path");
const URL = require("./models/url");
//const cors = require("cors");
require("dotenv").config();
// Define the port (either from environment variable or default to 8080)
const PORT = process.env.PORT || 8080; // Using environment variable if set, else default to 8080

app.use(express.static(path.join(__dirname, "Frontend")));
app.use(express.json());

const cors = require("cors");
const corsOpts = {
  origin: "*", // Allows any origin; can be restricted to specific domains
  methods: ["GET", "POST"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true, 
};

app.use(cors(corsOpts));

//app.options("*", cors());
// Parse JSON body
app.use(express.json());
connectToMySQL();

// Sync the models (if you want to create tables based on your models)
sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables synced!");
});

// Use the route to handle URL shortening requests
app.use("/", urlRoute);

// Handle redirect for shortened URL
app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  try {
    // Look for the shortened URL in the database
    const urlEntry = await URL.findOne({ where: { shortId } });

    if (!urlEntry) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Redirect to the original URL
    return res.redirect(urlEntry.redirectURL);
  } catch (error) {
    console.error("Error redirecting:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
