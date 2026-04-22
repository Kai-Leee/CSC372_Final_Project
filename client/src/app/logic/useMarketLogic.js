import { useEffect, useState } from "react";
import { appService } from "../services";
import { WATCHLIST_SYMBOLS } from "../../model/dashboardModel";

const WATCHLIST_STORAGE_KEY = "sp_watchlist_symbols";

function normalizeSymbol(value) {
  return String(value || "").trim().toUpperCase();
}

export function useMarketLogic() {
  const [quotes, setQuotes] = useState([]);
  const [symbolInput, setSymbolInput] = useState("");
  const [watchlistSymbols, setWatchlistSymbols] = useState(() => {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) return WATCHLIST_SYMBOLS;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return WATCHLIST_SYMBOLS;
      return parsed.map(normalizeSymbol).filter(Boolean).slice(0, 10);
    } catch {
      return WATCHLIST_SYMBOLS;
    }
  });

  useEffect(() => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlistSymbols));
  }, [watchlistSymbols]);

  useEffect(() => {
    let isActive = true;

    async function loadMarketData() {
      try {
        const watchlistResult = await appService.market.watchlist(watchlistSymbols);
        if (!isActive) return;
        setQuotes(watchlistResult.quotes || []);
      } catch {
        if (!isActive) return;
        setQuotes([]);
      }
    }

    loadMarketData();
    return () => {
      isActive = false;
    };
  }, [watchlistSymbols]);

  function addSymbol() {
    const normalized = normalizeSymbol(symbolInput);
    if (!normalized) return;
    setWatchlistSymbols((prev) => {
      if (prev.includes(normalized)) return prev;
      return [...prev, normalized].slice(0, 10);
    });
    setSymbolInput("");
  }

  function removeSymbol(symbol) {
    const normalized = normalizeSymbol(symbol);
    setWatchlistSymbols((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item !== normalized);
    });
  }

  return {
    quotes,
    symbolInput,
    setSymbolInput,
    watchlistSymbols,
    addSymbol,
    removeSymbol,
  };
}
