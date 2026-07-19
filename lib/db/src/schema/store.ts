import { pgTable, text, serial, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storePackagesTable = pgTable("store_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  type: text("type").notNull().default("vip"),
  features: text("features").notNull().default("[]"),
  popular: boolean("popular").notNull().default(false),
  color: text("color"),
  badgeText: text("badge_text"),
});

export const insertStorePackageSchema = createInsertSchema(storePackagesTable).omit({ id: true });
export type InsertStorePackage = z.infer<typeof insertStorePackageSchema>;
export type StorePackage = typeof storePackagesTable.$inferSelect;
