import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the schema for the stock data
export const stockData = pgTable("stock_data", {
  id: serial("id").primaryKey(),
  ticker: text("ticker").notNull(),
  lastPrice: integer("last_price").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const insertStockDataSchema = createInsertSchema(stockData).pick({
  ticker: true,
  lastPrice: true,
  timestamp: true,
});

export type InsertStockData = z.infer<typeof insertStockDataSchema>;
export type StockData = typeof stockData.$inferSelect;

// Original schema for users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
