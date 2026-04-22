const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const marketRoutes = require("./routes/marketRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  const isCrudMethod = ["GET", "POST", "PUT", "DELETE"].includes(req.method);
  const isTaskRoute = req.path.startsWith("/api/tasks");
  if (!isCrudMethod || !isTaskRoute) {
    return next();
  }

  const startedAt = Date.now();
  res.on("finish", () => {
    const elapsedMs = Date.now() - startedAt;
    console.log(
      `[TASK-CRUD] ${req.method} ${req.originalUrl} -> ${res.statusCode}`
    );
  });

  return next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/market", marketRoutes);

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

module.exports = app;
