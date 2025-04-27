import { pgTable, text, serial, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the token table
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  decimals: numeric("decimals").notNull(),
  logoUrl: text("logo_url"),
  isTestnet: boolean("is_testnet").notNull().default(true),
});

// Define the swap routes table
export const swapRoutes = pgTable("swap_routes", {
  id: serial("id").primaryKey(),
  fromTokenId: numeric("from_token_id").references(() => tokens.id).notNull(),
  toTokenId: numeric("to_token_id").references(() => tokens.id).notNull(),
  amount: text("amount").notNull(),
  provider: text("provider").notNull(),
  estimatedOutput: text("estimated_output").notNull(),
  gasEstimate: text("gas_estimate").notNull(),
  slippage: numeric("slippage").notNull(),
  improvement: numeric("improvement"),
  path: text("path").array(),
  executedByUser: boolean("executed_by_user").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define the ai analysis table
export const aiAnalysis = pgTable("ai_analysis", {
  id: serial("id").primaryKey(),
  fromTokenId: numeric("from_token_id").references(() => tokens.id).notNull(),
  toTokenId: numeric("to_token_id").references(() => tokens.id).notNull(),
  amount: text("amount").notNull(),
  summary: text("summary").notNull(),
  insights: text("insights").array(),
  marketConditions: text("market_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define the user settings table
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  slippageTolerance: numeric("slippage_tolerance").default("0.5"),
  deadline: numeric("deadline").default(30),
  gasPreference: text("gas_preference").default("auto"),
  riskProfile: text("risk_profile").default("balanced"),
  preferredDexs: text("preferred_dexs").array(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Create insert schemas
export const insertTokenSchema = createInsertSchema(tokens);
export const insertSwapRouteSchema = createInsertSchema(swapRoutes);
export const insertAiAnalysisSchema = createInsertSchema(aiAnalysis);
export const insertUserSettingsSchema = createInsertSchema(userSettings);

// Create types
export type Token = typeof tokens.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;

export type SwapRoute = typeof swapRoutes.$inferSelect;
export type InsertSwapRoute = z.infer<typeof insertSwapRouteSchema>;

export type AIAnalysis = typeof aiAnalysis.$inferSelect;
export type InsertAIAnalysis = z.infer<typeof insertAiAnalysisSchema>;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

// Extended schemas for validation
export const geminiRequestSchema = z.object({
  fromToken: z.string(),
  toToken: z.string(),
  amount: z.string(),
  slippageTolerance: z.number().optional(),
  deadline: z.number().optional(),
  gasPreference: z.string().optional(),
  riskProfile: z.string().optional(),
  preferredDexs: z.array(z.string()).optional(),
});

export type GeminiRequest = z.infer<typeof geminiRequestSchema>;
