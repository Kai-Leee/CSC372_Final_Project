function TaskManagementComponent({
  newTask,
  setNewTask,
  taskEditorMode,
  onCancelTaskEdit,
  selectedTask,
  editTask,
  setEditTask,
  onAddTask,
  onSaveTask,
  onDeleteTask,
}) {
  return (
    <article className="panel">
      <h2>Task Management View</h2>
      {taskEditorMode === "add" && (
        <>
          <form className="add-task-form" onSubmit={onAddTask}>
            <input
              placeholder="New Task"
              value={newTask.title}
              onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <button type="submit" className="primary-btn">
              Add Task
            </button>
          </form>

          <div className="form-row">
            <label>
              Category
              <select
                value={newTask.category}
                onChange={(e) => setNewTask((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
              </select>
            </label>
            <label>
              Priority
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value }))}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Due Date
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))}
              />
            </label>
          </div>
          <label>
            Notes
            <textarea
              rows={7}
              value={newTask.notes}
              onChange={(e) => setNewTask((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Optional notes"
            />
          </label>
        </>
      )}

      {taskEditorMode === "edit" && (
        <div className="sub-panel">
          <h3>Edit Selected Task</h3>
          {!selectedTask && <p>Select a task to edit from Task Details.</p>}
          {selectedTask && (
            <form className="details-form" onSubmit={onSaveTask}>
              <label>
                Title
                <input
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </label>
              <label>
                Due Date
                <input
                  type="date"
                  value={editTask.dueDate}
                  onChange={(e) =>
                    setEditTask((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                />
              </label>
              <label>
                Notes
                <textarea
                  rows={6}
                  value={editTask.notes}
                  onChange={(e) =>
                    setEditTask((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </label>
              <div className="form-row">
                <label>
                  Category
                  <select
                    value={editTask.category}
                    onChange={(e) =>
                      setEditTask((prev) => ({ ...prev, category: e.target.value }))
                    }
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                  </select>
                </label>
                <label>
                  Priority
                  <select
                    value={editTask.priority}
                    onChange={(e) =>
                      setEditTask((prev) => ({ ...prev, priority: e.target.value }))
                    }
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
              </div>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={editTask.completed}
                  onChange={(e) =>
                    setEditTask((prev) => ({ ...prev, completed: e.target.checked }))
                  }
                />
                Completed
              </label>
              <div className="inline-actions">
                <button type="submit" className="primary-btn">
                  Save
                </button>
                <button type="button" onClick={onDeleteTask}>
                  Delete
                </button>
                <button type="button" onClick={onCancelTaskEdit}>
                  Cancel Edit
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </article>
  );
}

export default TaskManagementComponent;
