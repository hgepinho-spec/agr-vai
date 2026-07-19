import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  steamId: varchar("steam_id", { length: 20 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull(),
  avatar: text("avatar"),
  avatarFull: text("avatar_full"),
  profileUrl: text("profile_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
