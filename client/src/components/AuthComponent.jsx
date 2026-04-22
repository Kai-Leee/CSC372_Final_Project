function AuthComponent({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authError,
  onSubmit,
}) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Smart Portfolio & Task Dashboard</h1>
        <p>Track your market watchlist and organize your daily priorities.</p>

        <div className="auth-toggle">
          <button
            className={authMode === "login" ? "is-active" : ""}
            onClick={() => setAuthMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={authMode === "register" ? "is-active" : ""}
            onClick={() => setAuthMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {authMode === "register" && (
            <label>
              Name
              <input
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm((prev) => ({ ...prev, password: e.target.value }))
              }
              minLength={6}
              required
            />
          </label>
          {authError && <p className="error-text">{authError}</p>}
          <button type="submit" className="primary-btn">
            {authMode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthComponent;

