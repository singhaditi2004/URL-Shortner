const shortid = require("shortid");
const URL = require("../models/url");

async function handlegenerateNewShortUrl(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ message: "URL is required" });
  }

  // Validate URL format (you can extend or modify the regex as needed)
  const validUrlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!validUrlRegex.test(body.url)) {
    return res.status(400).json({ message: "Invalid URL format" });
  }

  try {
    // Check if the URL already exists
    let urlEntry = await URL.findOne({ where: { redirectURL: body.url } });

    if (urlEntry) {
      const baseUrl =
        process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      return res.json({
        shortUrl: `${baseUrl}/${urlEntry.shortId}`,
      });
    }

    // Generate a new short ID if URL doesn't exist
    let shortId = shortid.generate();
    let urlEntryWithShortId = await URL.findOne({ where: { shortId } });

    // Ensure the shortId is unique (in rare cases where `shortid` might generate duplicates)
    while (urlEntryWithShortId) {
      shortId = shortid.generate();
      urlEntryWithShortId = await URL.findOne({ where: { shortId } });
    }

    const newUrl = await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: JSON.stringify([]),
    });

    return res.json({
      shortUrl: `${req.protocol}://${req.get("host")}/${newUrl.shortId}`,
    });
  } catch (error) {
    console.error("Database error", error);
    return res.status(500).json({ message: "Database error", error });
  }
}

module.exports = { handlegenerateNewShortUrl };
