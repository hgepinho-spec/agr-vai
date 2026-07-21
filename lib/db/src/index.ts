import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Sanitize: remove stray trailing characters (e.g. Railway ref variable artefacts)
const connectionString = process.env.DATABASE_URL.trim().replace(/[)]+$/, "");

// Log the database host/name for debugging (never log credentials)
try {
  const u = new URL(connectionString);
  console.log(`[db] Connecting to postgres: host=${u.hostname} db=${u.pathname}`);
} catch {
  console.warn("[db] Could not parse DATABASE_URL for logging");
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

export * from "./schema";
