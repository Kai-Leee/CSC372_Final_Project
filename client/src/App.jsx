import AuthComponent from "./components/AuthComponent";
import DashboardComponent from "./components/DashboardComponent";
import { asDateInputValue } from "./model/dashboardModel";
import { useAuthLogic } from "./app/logic/useAuthLogic";
import { useMarketLogic } from "./app/logic/useMarketLogic";
import { useTaskLogic } from "./app/logic/useTaskLogic";

function App() {
  const auth = useAuthLogic();
  const market = useMarketLogic();
  const tasks = useTaskLogic(auth.token, auth.clearSession);

  if (!auth.user) {
    return (
      <AuthComponent
        authMode={auth.authMode}
        setAuthMode={auth.setAuthMode}
        authForm={auth.authForm}
        setAuthForm={auth.setAuthForm}
        authError={auth.authError}
        onSubmit={auth.handleAuthSubmit}
      />
    );
  }

  return (
    <DashboardComponent
      user={auth.user}
      loading={auth.loading || tasks.loading}
      taskError={tasks.taskError}
      onLogout={auth.handleLogout}
      quotes={market.quotes}
      detailTasks={tasks.detailTasks}
      detailSort={tasks.detailSort}
      setDetailSort={tasks.setDetailSort}
      onRequestTaskEdit={tasks.startTaskEdit}
      selectedTask={tasks.selectedTask}
      taskEditorMode={tasks.taskEditorMode}
      onCancelTaskEdit={tasks.cancelTaskEdit}
      editTask={tasks.editTask}
      setEditTask={tasks.setEditTask}
      onSaveTask={tasks.handleSaveTask}
      onDeleteTask={tasks.handleDeleteTask}
      newTask={tasks.newTask}
      setNewTask={tasks.setNewTask}
      onAddTask={tasks.handleAddTask}
      asDateInputValue={asDateInputValue}
      symbolInput={market.symbolInput}
      setSymbolInput={market.setSymbolInput}
      watchlistSymbols={market.watchlistSymbols}
      onAddSymbol={market.addSymbol}
      onRemoveSymbol={market.removeSymbol}
    />
  );
}

export default App;
