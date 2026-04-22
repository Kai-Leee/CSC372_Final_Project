export const WATCHLIST_SYMBOLS = ["AAPL", "MSFT", "BINANCE:BTCUSDT"];

export const defaultNewTask = {
  title: "",
  notes: "",
  category: "personal",
  priority: "medium",
  dueDate: "",
};

export const defaultEditTask = {
  title: "",
  notes: "",
  category: "personal",
  priority: "medium",
  dueDate: "",
  completed: false,
};

export function asDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export function createEditTaskFromSelected(task) {
  if (!task) return { ...defaultEditTask };
  return {
    title: task.title || "",
    notes: task.notes || "",
    category: task.category || "personal",
    priority: task.priority || "medium",
    dueDate: asDateInputValue(task.due_date || task.dueDate),
    completed: !!task.completed,
  };
}

export function inferPriorityFromInput({ title, dueDate }) {
  const normalizedTitle = String(title || "").toLowerCase();
  const urgentKeywords = ["urgent", "asap", "important", "exam", "report", "deadline"];

  const hasUrgentKeyword = urgentKeywords.some((keyword) =>
    normalizedTitle.includes(keyword)
  );
  if (hasUrgentKeyword) return "high";

  if (!dueDate) return "medium";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const dayDiff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (dayDiff <= 1) return "high";
  if (dayDiff <= 5) return "medium";
  return "low";
}

export function getVisibleTasks(tasks, filters, sort) {
  const today = new Date().toISOString().slice(0, 10);
  const normalizedFilters = {
    priority: filters?.priority || "all",
    deadline: filters?.deadline || "all",
    category: filters?.category || "all",
  };

  const filtered = tasks.filter((task) => {
    const dueDate = asDateInputValue(task.due_date || task.dueDate);
    const priority = String(task.priority || "").toLowerCase();
    const category = String(task.category || "").toLowerCase();
    const hasDueDate = Boolean(dueDate);

    const matchesPriority =
      normalizedFilters.priority === "all" || priority === normalizedFilters.priority;

    const matchesCategory =
      normalizedFilters.category === "all" || category === normalizedFilters.category;

    const matchesDeadline = (() => {
      if (normalizedFilters.deadline === "all") return true;
      if (normalizedFilters.deadline === "today") return dueDate === today;
      if (normalizedFilters.deadline === "upcoming") return hasDueDate && dueDate > today;
      if (normalizedFilters.deadline === "overdue") return hasDueDate && dueDate < today;
      if (normalizedFilters.deadline === "no_due") return !hasDueDate;
      return true;
    })();

    return matchesPriority && matchesCategory && matchesDeadline;
  });

  const priorityRank = { high: 0, medium: 1, low: 2 };

  return [...filtered].sort((a, b) => {
    if (sort === "priority") {
      const aPriority = String(a.priority || "").toLowerCase();
      const bPriority = String(b.priority || "").toLowerCase();
      const aRank = priorityRank[aPriority] ?? 99;
      const bRank = priorityRank[bPriority] ?? 99;
      return aRank - bRank;
    }
    const aDate = asDateInputValue(a.due_date || a.dueDate);
    const bDate = asDateInputValue(b.due_date || b.dueDate);
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return aDate.localeCompare(bDate);
  });
}

export function sortTasksForDetails(tasks, sortBy) {
  const priorityRank = { high: 0, medium: 1, low: 2 };

  return [...tasks].sort((a, b) => {
    if (sortBy === "priority") {
      const aRank = priorityRank[String(a.priority || "").toLowerCase()] ?? 99;
      const bRank = priorityRank[String(b.priority || "").toLowerCase()] ?? 99;
      return aRank - bRank;
    }

    if (sortBy === "title") {
      return String(a.title || "").localeCompare(String(b.title || ""));
    }

    if (sortBy === "created") {
      return String(b.created_at || "").localeCompare(String(a.created_at || ""));
    }

    const aDate = asDateInputValue(a.due_date || a.dueDate);
    const bDate = asDateInputValue(b.due_date || b.dueDate);
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return aDate.localeCompare(bDate);
  });
}
