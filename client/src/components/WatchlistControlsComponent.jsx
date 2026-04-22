function WatchlistControlsComponent({
  symbolInput,
  setSymbolInput,
  watchlistSymbols,
  onAddSymbol,
  onRemoveSymbol,
}) {
  return (
    <div className="watchlist-controls">
      <div className="add-symbol-row">
        <input
          placeholder="Add symbol (e.g. AAPL, BINANCE:BTCUSDT)"
          value={symbolInput}
          onChange={(e) => setSymbolInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddSymbol();
            }
          }}
        />
        <button type="button" onClick={onAddSymbol}>
          Add
        </button>
      </div>
      <div className="watchlist-tags">
        {watchlistSymbols.map((symbol) => (
          <button
            key={symbol}
            type="button"
            className="tag-btn"
            onClick={() => onRemoveSymbol(symbol)}
            title="Remove from watchlist"
          >
            {symbol} ×
          </button>
        ))}
      </div>
    </div>
  );
}

export default WatchlistControlsComponent;
