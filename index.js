// File: app.js
const express = require("express");
const { sequelize, connectToMySQL } = require("./connect"); // Import from connect.js
const urlRoute = require("./routes/url");
const app = express();
const PORT = 8080;
const URL = require("./models/url");

app.use(express.json());

connectToMySQL();

// Sync the models (if you want to create tables based on your models)
sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables synced!");
});

// Use the route to handle URL shortening requests
app.use("/url", urlRoute);

// Redirect route and update visit history
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOne({
      where: { shortId: shortId },
    });

    if (!entry) {
      return res.status(404).send("URL not found");
    }

    // Parse the visitHistory array from JSON
    let visitHistory = JSON.parse(entry.visitHistory);

    // Add the current timestamp to the visitHistory
    visitHistory.push(new Date());

    // Update visit history in the database
    entry.visitHistory = JSON.stringify(visitHistory);
    await entry.save(); // Save the updated entry

    // Redirect to the original URL
    res.redirect(entry.redirectURL); // Use `redirectURL`, assuming it's your correct field
    console.log("Short ID:", shortId);
    console.log("Redirecting to:", entry.redirectURL);
  } catch (error) {
    console.error("Error while redirecting:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
