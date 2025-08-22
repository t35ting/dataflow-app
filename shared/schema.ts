import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const problems = pgTable("problems", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  tags: text("tags").array().notNull().default([]),
  link: text("link").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("Not Prepared"),
  notes: text("notes").default(""),
  slug: text("slug").notNull(),
  searchText: text("search_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedFromCsv: boolean("updated_from_csv").default(false),
  deleted: boolean("deleted").default(false),
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateProblemSchema = insertProblemSchema.partial().extend({
  id: z.string(),
});

export const csvRowSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  tags: z.string(),
  link: z.string().url("Invalid URL format"),
});

export const editKeySchema = z.object({
  key: z.string().min(1, "Edit key is required"),
});

export const problemFiltersSchema = z.object({
  search: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard", ""]).optional(),
  status: z.enum(["Not Prepared", "In Progress", "Prepared", ""]).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
  sortBy: z.enum(["id", "title", "difficulty", "status", "createdAt", "updatedAt"]).default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type UpdateProblem = z.infer<typeof updateProblemSchema>;
export type CsvRow = z.infer<typeof csvRowSchema>;
export type EditKey = z.infer<typeof editKeySchema>;
export type ProblemFilters = z.infer<typeof problemFiltersSchema>;

export type ProblemStats = {
  total: number;
  prepared: number;
  inProgress: number;
  notPrepared: number;
  percentagePrepared: number;
};

export type DifficultyStats = {
  difficulty: string;
  count: number;
};

export type TagStats = {
  tag: string;
  count: number;
};

export type ImportResult = {
  added: number;
  updated: number;
  skipped: number;
  errors: string[];
  warnings: string[];
};

export type ValidationReport = {
  rowsOk: number;
  rowsWithWarnings: number;
  rowsWithErrors: number;
  errors: Array<{ row: number; field: string; message: string }>;
  warnings: Array<{ row: number; field: string; message: string }>;
};
