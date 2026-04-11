import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const { default: connectDB, closeDBConnection } = await import("./config/db.js");
const { ensureDefaultSuperAdmin, backfillMissingDepartmentsToCSE } = await import("./services/bootstrapSuperAdmin.js");
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  await connectDB();
  await backfillMissingDepartmentsToCSE();
  await ensureDefaultSuperAdmin();

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server gracefully...`);

  const closeDatabase = async () => {
    try {
      await closeDBConnection();
      console.log("Database connection closed.");
    } catch (error) {
      console.error("Error while closing database connection:", error.message);
    }
  };

  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      closeDatabase().finally(() => process.exit(0));
    });
  } else {
    closeDatabase().finally(() => process.exit(0));
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
