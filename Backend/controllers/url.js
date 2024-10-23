const shortid = require("shortid");
const URL = require("../models/url");

async function handlegenerateNewShortUrl(req, res) {
    const body = req.body;

    // Input validation
    if (!body.url) {
        return res.status(400).json({
            success: false,
            message: "URL is required"
        });
    }

    // Enhanced URL validation regex
    const validUrlRegex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})[\/\w .-]*\/?$/;
    
    try {
        // Clean the URL by trimming whitespace
        const cleanUrl = body.url.trim();

        // Validate URL format
        if (!validUrlRegex.test(cleanUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid URL format. Please provide a valid HTTP or HTTPS URL"
            });
        }

        // Check if URL already exists
        const existingUrl = await URL.findOne({
            where: { redirectURL: cleanUrl }
        });

        if (existingUrl) {
            // Construct the short URL based on environment
            const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
            return res.json({
                success: true,
                shortId: existingUrl.shortId,
                shortUrl: `${baseUrl}/${existingUrl.shortId}`,
                message: "Existing short URL returned"
            });
        }

        // Generate new short ID with collision handling
        let shortId;
        let urlEntryWithShortId;
        let attempts = 0;
        const MAX_ATTEMPTS = 5;

        do {
            shortId = shortid.generate();
            urlEntryWithShortId = await URL.findOne({ where: { shortId } });
            attempts++;

            if (attempts >= MAX_ATTEMPTS) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to generate unique short ID. Please try again."
                });
            }
        } while (urlEntryWithShortId);

        // Create new URL entry
        const newUrl = await URL.create({
            shortId,
            redirectURL: cleanUrl,
            visitHistory: JSON.stringify([]),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Construct response URL
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        const shortUrl = `${baseUrl}/${shortId}`;

        return res.status(201).json({
            success: true,
            shortId: shortId,
            shortUrl: shortUrl,
            message: "Short URL created successfully"
        });

    } catch (error) {
        console.error("URL generation error:", error);
        
        return res.status(500).json({
            success: false,
            message: "An error occurred while generating the short URL",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    handlegenerateNewShortUrl
};