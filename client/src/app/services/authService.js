import { request } from "./baseService";

export const authService = {
  register: (body) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: (token) =>
    request("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  logout: (token) =>
    request("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

