import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app";
import { logger } from "./lib/logger";
import { seedDatabase } from "./seed";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Push DB schema before starting (only in production; dev uses workflow)
if (process.env.NODE_ENV === "production") {
  const dbDir = path.resolve(__dirname, "../../../lib/db");
  logger.info({ dbDir }, "Running DB schema push...");
  const result = spawnSync("pnpm", ["run", "push-force"], {
    cwd: dbDir,
    stdio: "inherit",
    env: process.env,
    shell: false,
  });
  if (result.status !== 0) {
    logger.warn("DB push exited with non-zero status, continuing anyway...");
  } else {
    logger.info("DB schema push complete");
  }
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  seedDatabase();
});
