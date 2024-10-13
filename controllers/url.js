const shortid = require("shortid");
const URL = require("../models/url");

async function handlegenerateNewShortUrl(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    // Check if the URL already exists
    let urlEntry = await URL.findOne({ where: { redirectURL: body.url } });

    if (urlEntry) {
      // If the URL exists, return the existing shortId
      return res.json({ id: urlEntry.shortId });
    }

    // Generate a new short ID if URL doesn't exist
    const shortId = shortid.generate(); // Generating a new unique shortId

    // Create the entry in MySQL
    const newUrl = await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: JSON.stringify([]), // Initialize visit history as an empty array
    });

    return res.json({ id: newUrl.shortId });
  } catch (error) {
    console.error("Database error", error);
    return res.status(500).json({ message: "Database error", error });
  }
}

module.exports = { handlegenerateNewShortUrl };
