import { useEffect, useMemo, useState } from "react";
import { appService } from "../services";
import {
  createEditTaskFromSelected,
  defaultEditTask,
  defaultNewTask,
  sortTasksForDetails,
} from "../../model/dashboardModel";

export function useTaskLogic(token, onTokenInvalid) {
  const [tasks, setTasks] = useState([]);
  const [detailSort, setDetailSort] = useState("date");
  const [taskEditorMode, setTaskEditorMode] = useState("add");
  const [newTask, setNewTask] = useState({ ...defaultNewTask });
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ ...defaultEditTask });
  const [taskError, setTaskError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadTasks() {
      if (!token) {
        setTasks([]);
        setSelectedTaskId(null);
        return;
      }

      setLoading(true);
      try {
        const taskResult = await appService.tasks.list(token);
        if (!isActive) return;
        setTasks(taskResult.tasks || []);
      } catch {
        if (!isActive) return;
        setTasks([]);
        onTokenInvalid?.();
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadTasks();
    return () => {
      isActive = false;
    };
  }, [token, onTokenInvalid]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  useEffect(() => {
    setEditTask(createEditTaskFromSelected(selectedTask));
  }, [selectedTask]);

  useEffect(() => {
    if (!selectedTask && taskEditorMode === "edit") {
      setTaskEditorMode("add");
    }
  }, [selectedTask, taskEditorMode]);

  const detailTasks = useMemo(() => sortTasksForDetails(tasks, detailSort), [tasks, detailSort]);

  async function handleAddTask(event) {
    event.preventDefault();
    if (!token) return;
    setTaskError("");

    try {
      const result = await appService.tasks.create(token, {
        ...newTask,
        dueDate: newTask.dueDate || null,
      });
      setTasks((prev) => [result.task, ...prev]);
      setSelectedTaskId(result.task.id);
      setNewTask({ ...defaultNewTask });
      setTaskEditorMode("add");
    } catch (error) {
      setTaskError(error.message);
    }
  }

  async function handleSaveTask(event) {
    event.preventDefault();
    if (!token || !selectedTask) return;
    setTaskError("");

    try {
      const result = await appService.tasks.update(token, selectedTask.id, {
        ...editTask,
        dueDate: editTask.dueDate || null,
      });
      setTasks((prev) =>
        prev.map((item) => (item.id === selectedTask.id ? result.task : item))
      );
      setTaskEditorMode("add");
    } catch (error) {
      setTaskError(error.message);
    }
  }

  async function handleDeleteTask() {
    if (!token || !selectedTask) return;
    setTaskError("");

    try {
      await appService.tasks.remove(token, selectedTask.id);
      setTasks((prev) => prev.filter((item) => item.id !== selectedTask.id));
      setSelectedTaskId(null);
      setTaskEditorMode("add");
    } catch (error) {
      setTaskError(error.message);
    }
  }

  function startTaskEdit(taskId) {
    setSelectedTaskId(taskId);
    setTaskEditorMode("edit");
  }

  function cancelTaskEdit() {
    setTaskEditorMode("add");
  }

  return {
    taskError,
    loading,
    selectedTask,
    editTask,
    setEditTask,
    newTask,
    setNewTask,
    taskEditorMode,
    detailSort,
    setDetailSort,
    detailTasks,
    selectedTaskId,
    setSelectedTaskId,
    handleAddTask,
    handleSaveTask,
    handleDeleteTask,
    startTaskEdit,
    cancelTaskEdit,
  };
}
