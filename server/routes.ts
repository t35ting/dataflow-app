import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProblemSchema, 
  updateProblemSchema, 
  editKeySchema, 
  problemFiltersSchema,
  csvRowSchema,
  type CsvRow,
  type ValidationReport 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get problems with filters
  app.get("/api/problems", async (req, res) => {
    try {
      const filters = problemFiltersSchema.parse({
        search: req.query.search as string,
        difficulty: req.query.difficulty as string,
        status: req.query.status as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        sortBy: req.query.sortBy as string || "id",
        sortOrder: req.query.sortOrder as string || "asc",
      });

      const result = await storage.getProblems(filters);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  // Get single problem
  app.get("/api/problems/:id", async (req, res) => {
    const problem = await storage.getProblemById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  });

  // Create problem
  app.post("/api/problems", async (req, res) => {
    try {
      const problemData = insertProblemSchema.parse(req.body);
      const problem = await storage.createProblem(problemData);
      res.status(201).json(problem);
    } catch (error) {
      res.status(400).json({ message: "Invalid problem data" });
    }
  });

  // Update problem
  app.patch("/api/problems/:id", async (req, res) => {
    try {
      const updates = updateProblemSchema.parse({ ...req.body, id: req.params.id });
      const problem = await storage.updateProblem(req.params.id, updates);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Delete problem
  app.delete("/api/problems/:id", async (req, res) => {
    const success = await storage.deleteProblem(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json({ message: "Problem deleted successfully" });
  });

  // Validate CSV data
  app.post("/api/csv/validate", async (req, res) => {
    try {
      const { rows } = req.body;
      if (!Array.isArray(rows)) {
        return res.status(400).json({ message: "Invalid CSV data" });
      }

      const report: ValidationReport = {
        rowsOk: 0,
        rowsWithWarnings: 0,
        rowsWithErrors: 0,
        errors: [],
        warnings: [],
      };

      const validatedRows: any[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let hasError = false;
        let hasWarning = false;

        try {
          // Validate basic structure
          const validatedRow = csvRowSchema.parse(row);
          
          // Normalize difficulty
          const normalizedDifficulty = normalizeDifficulty(validatedRow.difficulty);
          if (normalizedDifficulty === "Unknown") {
            report.warnings.push({
              row: i + 1,
              field: "difficulty",
              message: `Unrecognized difficulty "${validatedRow.difficulty}", set to Unknown`
            });
            hasWarning = true;
          }

          // Normalize tags
          const normalizedTags = normalizeTags(validatedRow.tags);

          // Create slug
          const slug = createSlug(validatedRow.title);

          // Create search text
          const searchText = `${validatedRow.title} ${normalizedTags.join(" ")}`.toLowerCase();

          validatedRows.push({
            id: validatedRow.id.trim(),
            title: validatedRow.title.trim(),
            difficulty: normalizedDifficulty,
            tags: normalizedTags,
            link: validatedRow.link.trim(),
            slug,
            searchText,
          });

          if (!hasError && !hasWarning) {
            report.rowsOk++;
          } else if (hasWarning) {
            report.rowsWithWarnings++;
          }

        } catch (error) {
          report.errors.push({
            row: i + 1,
            field: "general",
            message: error instanceof Error ? error.message : "Validation failed"
          });
          report.rowsWithErrors++;
          hasError = true;
        }
      }

      res.json({ report, validatedRows });
    } catch (error) {
      res.status(500).json({ message: "Validation failed" });
    }
  });

  // Import CSV data
  app.post("/api/csv/import", async (req, res) => {
    try {
      const { validatedRows } = req.body;
      if (!Array.isArray(validatedRows)) {
        return res.status(400).json({ message: "Invalid CSV data" });
      }

      const result = await storage.upsertProblems(validatedRows);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Import failed" });
    }
  });

  // Check edit key
  app.post("/api/auth/edit-key", async (req, res) => {
    try {
      const { key } = editKeySchema.parse(req.body);
      const valid = storage.checkEditKey(key);
      res.json({ valid });
    } catch (error) {
      res.status(400).json({ message: "Invalid key format" });
    }
  });

  // Get analytics stats
  app.get("/api/analytics/stats", async (req, res) => {
    const stats = await storage.getProblemStats();
    res.json(stats);
  });

  // Get difficulty distribution
  app.get("/api/analytics/difficulty", async (req, res) => {
    const stats = await storage.getDifficultyStats();
    res.json(stats);
  });

  // Get tag distribution
  app.get("/api/analytics/tags", async (req, res) => {
    const stats = await storage.getTagStats();
    res.json(stats);
  });

  // Export problems
  app.get("/api/export", async (req, res) => {
    const problems = await storage.exportProblems();
    
    // Convert to CSV format
    const csvHeader = "ID,Title,Difficulty,Tags,Link,Status,Notes\n";
    const csvRows = problems.map(p => 
      `"${p.id}","${p.title}","${p.difficulty}","${p.tags.join('; ')}","${p.link}","${p.status}","${p.notes || ''}"`
    ).join('\n');
    
    const csv = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="problems_export.csv"');
    res.send(csv);
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Utility functions
function normalizeDifficulty(difficulty: string): string {
  const normalized = difficulty.toLowerCase().trim();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "med") return "Medium";
  if (normalized === "hard") return "Hard";
  return "Unknown";
}

function normalizeTags(tagsString: string): string[] {
  return tagsString
    .split(/[,;]/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .sort();
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
