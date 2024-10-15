const express = require("express");
const router = express.Router();
const { handlegenerateNewShortUrl } = require("../controllers/url");

router.post("/", handlegenerateNewShortUrl);

module.exports = router;
