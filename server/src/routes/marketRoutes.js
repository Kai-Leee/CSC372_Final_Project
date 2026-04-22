const express = require("express");
const marketController = require("../controllers/marketController");

const router = express.Router();

router.get("/watchlist", marketController.getWatchlist);
router.get("/news", marketController.getNews);

module.exports = router;
