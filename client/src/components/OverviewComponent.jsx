function OverviewComponent({
  quotes,
  detailTasks,
  detailSort,
  setDetailSort,
  asDateInputValue,
  onRequestTaskEdit,
}) {
  return (
    <article className="panel">
      <h2>Dashboard Overview</h2>
      <div className="sub-panel">
        <h3>Stock & Crypto Snapshot</h3>
        {quotes.map((quote) => (
          <div className="row" key={quote.symbol}>
            <span>{quote.symbol}</span>
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

      <div className="sub-panel">
        <h3>Task Details</h3>
        <label>
          Sort
          <select value={detailSort} onChange={(e) => setDetailSort(e.target.value)}>
            <option value="date">By Due Date</option>
            <option value="priority">By Priority</option>
            <option value="created">By Created Time</option>
            <option value="title">By Title</option>
          </select>
        </label>
        <ul className="task-list">
          {detailTasks.map((task) => (
            <li key={task.id}>
              <div className="task-meta">
                <span>{task.title}</span>
                <span>{task.priority}</span>
                <span>{asDateInputValue(task.due_date) || "No due date"}</span>
              </div>
              <div className="inline-actions">
                <button type="button" onClick={() => onRequestTaskEdit(task.id)}>
                  Edit in Task Management
                </button>
              </div>
            </li>
          ))}
          {!detailTasks.length && <li className="empty">No tasks to display.</li>}
        </ul>
      </div>
    </article>
  );
}

export default OverviewComponent;
