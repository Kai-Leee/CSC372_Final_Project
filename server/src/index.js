const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app");
const pool = require("./db/dbConnection");

const PORT = process.env.PORT || 3001;

async function startServer() {
  await pool.query("SELECT NOW()");

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
