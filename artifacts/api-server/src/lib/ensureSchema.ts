import { pool } from "@workspace/db";
import { logger } from "./logger";

/**
 * Creates all tables if they don't exist yet.
 * Runs at startup so the Railway Postgres DB is always ready.
 */
export async function ensureSchema(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        steam_id    VARCHAR(20)  NOT NULL UNIQUE,
        username    VARCHAR(100) NOT NULL,
        avatar      TEXT,
        avatar_full TEXT,
        profile_url TEXT,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        sid    VARCHAR      NOT NULL PRIMARY KEY,
        sess   JSON         NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_sessions_expire ON sessions (expire);

      CREATE TABLE IF NOT EXISTS news (
        id         SERIAL PRIMARY KEY,
        title      TEXT NOT NULL,
        content    TEXT NOT NULL,
        category   TEXT NOT NULL DEFAULT 'announcement',
        author     TEXT NOT NULL,
        image_url  TEXT,
        pinned     BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS store_packages (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        description TEXT NOT NULL,
        price       REAL NOT NULL,
        type        TEXT NOT NULL DEFAULT 'vip',
        features    TEXT NOT NULL DEFAULT '[]',
        popular     BOOLEAN NOT NULL DEFAULT FALSE,
        color       TEXT,
        badge_text  TEXT
      );

      CREATE TABLE IF NOT EXISTS staff (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        role        TEXT NOT NULL DEFAULT 'helper',
        discord_tag TEXT NOT NULL,
        avatar_url  TEXT,
        online      BOOLEAN NOT NULL DEFAULT FALSE,
        bio         TEXT
      );

      CREATE TABLE IF NOT EXISTS faq (
        id       SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer   TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'General',
        "order"  INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS ban_appeals (
        id          SERIAL PRIMARY KEY,
        player_name TEXT NOT NULL,
        steam_id    TEXT NOT NULL,
        reason      TEXT NOT NULL,
        description TEXT NOT NULL,
        discord_tag TEXT NOT NULL,
        proof_url   TEXT,
        status      TEXT NOT NULL DEFAULT 'pending',
        admin_note  TEXT,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact (
        id         SERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        email      TEXT NOT NULL,
        subject    TEXT NOT NULL,
        message    TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS votes (
        id          SERIAL PRIMARY KEY,
        player_name TEXT NOT NULL,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS leaderboard (
        id          SERIAL PRIMARY KEY,
        player_name TEXT NOT NULL,
        kills       INTEGER NOT NULL DEFAULT 0,
        deaths      INTEGER NOT NULL DEFAULT 0,
        survived    INTEGER NOT NULL DEFAULT 0,
        playtime    INTEGER NOT NULL DEFAULT 0,
        loot        INTEGER NOT NULL DEFAULT 0,
        avatar_url  TEXT,
        last_seen   TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    logger.info("Schema ensured");
  } catch (err) {
    logger.error({ err }, "Failed to ensure schema");
    throw err;
  } finally {
    client.release();
  }
}
