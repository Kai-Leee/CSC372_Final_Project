import { useCallback, useEffect, useState } from "react";
import { appService } from "../services";

const EMPTY_AUTH_FORM = { name: "", email: "", password: "" };

export function useAuthLogic() {
  const [token, setToken] = useState(() => localStorage.getItem("sp_token") || "");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ ...EMPTY_AUTH_FORM });
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("sp_token", token);
    } else {
      localStorage.removeItem("sp_token");
    }
  }, [token]);

  useEffect(() => {
    let isActive = true;

    async function loadCurrentUser() {
      if (!token) {
        setUser(null);
        return;
      }

      setLoading(true);
      try {
        const meResult = await appService.auth.me(token);
        if (!isActive) return;
        setUser(meResult.user);
      } catch {
        if (!isActive) return;
        setToken("");
        setUser(null);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadCurrentUser();
    return () => {
      isActive = false;
    };
  }, [token]);

  const clearSession = useCallback(() => {
    setToken("");
    setUser(null);
  }, []);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");

    try {
      const body =
        authMode === "register"
          ? authForm
          : { email: authForm.email, password: authForm.password };
      const result =
        authMode === "register"
          ? await appService.auth.register(body)
          : await appService.auth.login(body);
      setToken(result.token);
      setAuthForm({ ...EMPTY_AUTH_FORM });
    } catch (error) {
      setAuthError(error.message);
    }
  }

  async function handleLogout() {
    if (token) {
      await appService.auth.logout(token).catch(() => {});
    }
    clearSession();
  }

  return {
    token,
    user,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    authError,
    loading,
    clearSession,
    handleAuthSubmit,
    handleLogout,
  };
}
