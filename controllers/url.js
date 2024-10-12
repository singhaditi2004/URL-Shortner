const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handlegenerateNewShortUrl(req, res) {
  const shortId = nanoid(5);
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ message: "url is required" });
  }

  try {
    // Create the entry in MySQL
    const newUrl = await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: JSON.stringify([]), // Store visit history as a JSON array
    });
    return res.json({ id: newUrl.shortId });
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
}

module.exports = {
  handlegenerateNewShortUrl,
};
