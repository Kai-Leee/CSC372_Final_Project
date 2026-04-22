const marketService = require("../services/marketService");

async function getWatchlist(req, res) {
  const payload = await marketService.getWatchlist(req.query.symbols);
  return res.json(payload);
}

async function getNews(req, res) {
  const payload = await marketService.getNews();
  return res.json(payload);
}

module.exports = {
  getWatchlist,
  getNews,
};

