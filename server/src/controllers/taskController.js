const taskModel = require("../model/taskModel");

async function getTasks(req, res) {
  try {
    const tasks = await taskModel.getTasksByUserId(req.user.id);
    return res.json({ tasks });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch tasks." });
  }
}

async function getTaskById(req, res) {
  try {
    const task = await taskModel.getTaskByIdForUser(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    return res.json({ task });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch task." });
  }
}

async function createTask(req, res) {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Task title is required." });
  }

  try {
    const task = await taskModel.createTaskForUser(req.user.id, req.body);
    return res.status(201).json({ task });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create task." });
  }
}

async function updateTask(req, res) {
  try {
    const currentTask = await taskModel.getTaskByIdForUser(req.params.id, req.user.id);
    if (!currentTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    const nextTitle = (req.body.title ?? currentTask.title).trim();
    if (!nextTitle) {
      return res.status(400).json({ error: "Task title cannot be empty." });
    }

    const task = await taskModel.updateTaskForUser(
      req.params.id,
      req.user.id,
      req.body,
      currentTask
    );
    return res.json({ task });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update task." });
  }
}

async function deleteTask(req, res) {
  try {
    const deleted = await taskModel.deleteTaskForUser(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: "Task not found." });
    }
    return res.json({ deletedId: deleted.id });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete task." });
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

