import { request } from "./baseService";

export const marketService = {
  watchlist: (symbols) =>
    request(`/market/watchlist?symbols=${encodeURIComponent(symbols.join(","))}`),
  news: () => request("/market/news"),
};

