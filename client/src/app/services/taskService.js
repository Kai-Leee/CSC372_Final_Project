import { request } from "./baseService";

export const taskService = {
  list: (token) =>
    request("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  create: (token, body) =>
    request("/tasks", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
  update: (token, taskId, body) =>
    request(`/tasks/${taskId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
  remove: (token, taskId) =>
    request(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

