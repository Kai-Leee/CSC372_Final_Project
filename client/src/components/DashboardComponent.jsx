import OverviewComponent from "./OverviewComponent";
import TaskManagementComponent from "./TaskManagementComponent";
import MarketTrackerComponent from "./MarketTrackerComponent";

function DashboardComponent({
  user,
  loading,
  taskError,
  onLogout,
  quotes,
  detailTasks,
  detailSort,
  setDetailSort,
  onRequestTaskEdit,
  selectedTask,
  taskEditorMode,
  onCancelTaskEdit,
  editTask,
  setEditTask,
  onSaveTask,
  onDeleteTask,
  newTask,
  setNewTask,
  onAddTask,
  asDateInputValue,
  symbolInput,
  setSymbolInput,
  watchlistSymbols,
  onAddSymbol,
  onRemoveSymbol,
}) {
  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Smart Portfolio & Task Dashboard</h1>
        <div className="header-actions">
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <p className="welcome-line">
        Signed in as <strong>{user.name}</strong> {loading ? " · Syncing..." : ""}
      </p>

      {taskError && <p className="error-text">{taskError}</p>}

      <section className="dashboard-grid">
        <OverviewComponent
          quotes={quotes}
          detailTasks={detailTasks}
          detailSort={detailSort}
          setDetailSort={setDetailSort}
          asDateInputValue={asDateInputValue}
          onRequestTaskEdit={onRequestTaskEdit}
        />
        <TaskManagementComponent
          newTask={newTask}
          setNewTask={setNewTask}
          taskEditorMode={taskEditorMode}
          onCancelTaskEdit={onCancelTaskEdit}
          selectedTask={selectedTask}
          editTask={editTask}
          setEditTask={setEditTask}
          onAddTask={onAddTask}
          onSaveTask={onSaveTask}
          onDeleteTask={onDeleteTask}
        />
        <MarketTrackerComponent
          quotes={quotes}
          symbolInput={symbolInput}
          setSymbolInput={setSymbolInput}
          watchlistSymbols={watchlistSymbols}
          onAddSymbol={onAddSymbol}
          onRemoveSymbol={onRemoveSymbol}
        />
      </section>
    </main>
  );
}

export default DashboardComponent;
