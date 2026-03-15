import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Newsletter Subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exchange Listing Applications
export const exchangeListings = pgTable("exchange_listings", {
  id: serial("id").primaryKey(),
  exchangeName: text("exchange_name").notNull(),
  exchangeType: text("exchange_type").notNull(),
  status: text("status").notNull().default("pending"),
  applicationData: text("application_data"),
  submittedAt: timestamp("submitted_at"),
  respondedAt: timestamp("responded_at"),
  responseNote: text("response_note"),
  liquidityRequired: text("liquidity_required"),
  liquidityMet: boolean("liquidity_met").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// SoulwareAI Autonomous Operations Log
export const autonomousOps = pgTable("autonomous_ops", {
  id: serial("id").primaryKey(),
  operationType: text("operation_type").notNull(),
  module: text("module").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("completed"),
  chain: text("chain"),
  txHash: text("tx_hash"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Founder Weekly Briefings
export const founderBriefings = pgTable("founder_briefings", {
  id: serial("id").primaryKey(),
  weekNumber: text("week_number").notNull(),
  reportContent: text("report_content").notNull(),
  presaleProgress: text("presale_progress"),
  daoStatus: text("dao_status"),
  exchangeStatus: text("exchange_status"),
  revenueReport: text("revenue_report"),
  nextActions: text("next_actions"),
  founderNotes: text("founder_notes"),
  founderDirectives: text("founder_directives"),
  status: text("status").notNull().default("pending"),
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Founder Directives (founder-only commands to SoulwareAI)
export const founderDirectives = pgTable("founder_directives", {
  id: serial("id").primaryKey(),
  directive: text("directive").notNull(),
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("pending"),
  soulwareResponse: text("soulware_response"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertExchangeListingSchema = createInsertSchema(exchangeListings).pick({
  exchangeName: true,
  exchangeType: true,
  status: true,
  applicationData: true,
  liquidityRequired: true,
  liquidityMet: true,
});

export const insertAutonomousOpSchema = createInsertSchema(autonomousOps).pick({
  operationType: true,
  module: true,
  description: true,
  status: true,
  chain: true,
  txHash: true,
  metadata: true,
});

export const insertFounderBriefingSchema = createInsertSchema(founderBriefings).pick({
  weekNumber: true,
  reportContent: true,
  presaleProgress: true,
  daoStatus: true,
  exchangeStatus: true,
  revenueReport: true,
  nextActions: true,
  status: true,
});

export const insertFounderDirectiveSchema = createInsertSchema(founderDirectives).pick({
  directive: true,
  priority: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertExchangeListing = z.infer<typeof insertExchangeListingSchema>;
export type InsertAutonomousOp = z.infer<typeof insertAutonomousOpSchema>;
export type InsertFounderBriefing = z.infer<typeof insertFounderBriefingSchema>;
export type InsertFounderDirective = z.infer<typeof insertFounderDirectiveSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type ExchangeListing = typeof exchangeListings.$inferSelect;
export type AutonomousOp = typeof autonomousOps.$inferSelect;
export type FounderBriefing = typeof founderBriefings.$inferSelect;
export type FounderDirective = typeof founderDirectives.$inferSelect;
