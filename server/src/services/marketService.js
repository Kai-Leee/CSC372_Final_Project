const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "BINANCE:BTCUSDT"];

const fallbackQuotes = [
  { symbol: "AAPL", price: 145.32, changePercent: 1.5 },
  { symbol: "MSFT", price: 422.15, changePercent: 0.9 },
  { symbol: "BINANCE:BTCUSDT", price: 42500, changePercent: 2.3 },
];

const fallbackNews = [
  {
    source: "Market Brief",
    headline: "Tech stocks rallied in afternoon trading.",
    url: "https://example.com/market-brief",
    datetime: Math.floor(Date.now() / 1000),
  },
  {
    source: "Crypto Daily",
    headline: "Bitcoin volatility cooled after earlier spike.",
    url: "https://example.com/crypto-daily",
    datetime: Math.floor(Date.now() / 1000),
  },
];

async function fetchFinnhubJson(path) {
  if (!process.env.FINNHUB_API_KEY) {
    return null;
  }

  const url = `${FINNHUB_BASE_URL}${path}${
    path.includes("?") ? "&" : "?"
  }token=${process.env.FINNHUB_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Finnhub request failed: ${response.status}`);
  }
  return response.json();
}

function getSymbolsFromQuery(symbolsQuery) {
  return (symbolsQuery || DEFAULT_SYMBOLS.join(","))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

async function getWatchlist(symbolsQuery) {
  const symbols = getSymbolsFromQuery(symbolsQuery);

  try {
    const quoteRows = await Promise.all(
      symbols.map(async (symbol) => {
        const quote = await fetchFinnhubJson(`/quote?symbol=${symbol}`);
        if (!quote || !quote.c) {
          const fallback =
            fallbackQuotes.find((row) => row.symbol === symbol) ||
            fallbackQuotes[0];
          return {
            symbol,
            price: fallback.price,
            changePercent: fallback.changePercent,
            source: "fallback",
          };
        }

        return {
          symbol,
          price: quote.c,
          changePercent: quote.dp,
          source: "finnhub",
        };
      })
    );

    return { quotes: quoteRows };
  } catch (error) {
    return {
      quotes: symbols.map((symbol, index) => ({
        symbol,
        price: fallbackQuotes[index % fallbackQuotes.length].price,
        changePercent: fallbackQuotes[index % fallbackQuotes.length].changePercent,
        source: "fallback",
      })),
    };
  }
}

async function getNews() {
  try {
    const news = await fetchFinnhubJson("/news?category=general");
    if (!news || !Array.isArray(news)) {
      return { news: fallbackNews };
    }

    return {
      news: news.slice(0, 6).map((item) => ({
        source: item.source,
        headline: item.headline,
        url: item.url,
        datetime: item.datetime,
      })),
    };
  } catch (error) {
    return { news: fallbackNews };
  }
}

module.exports = {
  getWatchlist,
  getNews,
};

