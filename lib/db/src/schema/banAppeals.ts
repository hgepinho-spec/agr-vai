import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const banAppealsTable = pgTable("ban_appeals", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  steamId: text("steam_id").notNull(),
  reason: text("reason").notNull(),
  description: text("description").notNull(),
  discordTag: text("discord_tag").notNull(),
  proofUrl: text("proof_url"),
  status: text("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertBanAppealSchema = createInsertSchema(banAppealsTable).omit({ id: true, createdAt: true, updatedAt: true, status: true, adminNote: true });
export type InsertBanAppeal = z.infer<typeof insertBanAppealSchema>;
export type BanAppeal = typeof banAppealsTable.$inferSelect;
