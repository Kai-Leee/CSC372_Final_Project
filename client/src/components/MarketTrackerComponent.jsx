import WatchlistControlsComponent from "./WatchlistControlsComponent";

function MarketTrackerComponent({
  quotes,
  symbolInput,
  setSymbolInput,
  watchlistSymbols,
  onAddSymbol,
  onRemoveSymbol,
}) {
  return (
    <article className="panel">
      <h2>Stock Tracker View</h2>
      <div className="sub-panel">
        <h3>Watchlist</h3>
        <WatchlistControlsComponent
          symbolInput={symbolInput}
          setSymbolInput={setSymbolInput}
          watchlistSymbols={watchlistSymbols}
          onAddSymbol={onAddSymbol}
          onRemoveSymbol={onRemoveSymbol}
        />
        {quotes.map((quote) => (
          <div className="row" key={quote.symbol}>
            <strong>{quote.symbol}</strong>
            <span>
              $
              {Number(quote.price).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
            <span className={quote.changePercent >= 0 ? "up" : "down"}>
              {quote.changePercent >= 0 ? "▲" : "▼"}
              {Math.abs(Number(quote.changePercent || 0)).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default MarketTrackerComponent;
