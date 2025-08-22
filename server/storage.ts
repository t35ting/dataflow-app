import { type Problem, type InsertProblem, type UpdateProblem, type ProblemFilters, type ProblemStats, type DifficultyStats, type TagStats, type ImportResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Problem CRUD operations
  getProblems(filters: ProblemFilters): Promise<{ problems: Problem[]; total: number }>;
  getProblemById(id: string): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  updateProblem(id: string, updates: UpdateProblem): Promise<Problem | undefined>;
  deleteProblem(id: string): Promise<boolean>;
  
  // Bulk operations
  upsertProblems(problems: InsertProblem[]): Promise<ImportResult>;
  
  // Analytics
  getProblemStats(): Promise<ProblemStats>;
  getDifficultyStats(): Promise<DifficultyStats[]>;
  getTagStats(): Promise<TagStats[]>;
  
  // Utility
  checkEditKey(key: string): boolean;
  exportProblems(): Promise<Problem[]>;
}

export class MemStorage implements IStorage {
  private problems: Map<string, Problem>;
  private readonly editKey = "qwerty@321123";

  constructor() {
    this.problems = new Map();
  }

  async getProblems(filters: ProblemFilters): Promise<{ problems: Problem[]; total: number }> {
    let allProblems = Array.from(this.problems.values()).filter(p => !p.deleted);

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      allProblems = allProblems.filter(p => 
        p.searchText.toLowerCase().includes(searchLower)
      );
    }

    if (filters.difficulty && filters.difficulty !== "") {
      allProblems = allProblems.filter(p => p.difficulty === filters.difficulty);
    }

    if (filters.status && filters.status !== "") {
      allProblems = allProblems.filter(p => p.status === filters.status);
    }

    // Sort
    allProblems.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      
      // For ID field, convert to number for proper numerical sorting
      if (filters.sortBy === "id") {
        const aNum = parseInt(aVal as string) || 0;
        const bNum = parseInt(bVal as string) || 0;
        return filters.sortOrder === "asc" ? aNum - bNum : bNum - aNum;
      }
      
      if (aVal < bVal) return filters.sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const total = allProblems.length;
    const start = (filters.page - 1) * filters.limit;
    const problems = allProblems.slice(start, start + filters.limit);

    return { problems, total };
  }

  async getProblemById(id: string): Promise<Problem | undefined> {
    const problem = this.problems.get(id);
    return problem && !problem.deleted ? problem : undefined;
  }

  async createProblem(problemData: InsertProblem): Promise<Problem> {
    const now = new Date();
    const problem: Problem = {
      ...problemData,
      status: problemData.status || "Not Prepared",
      tags: problemData.tags || [],
      notes: problemData.notes || "",
      createdAt: now,
      updatedAt: now,
      updatedFromCsv: false,
      deleted: false,
    };
    
    this.problems.set(problem.id, problem);
    return problem;
  }

  async updateProblem(id: string, updates: UpdateProblem): Promise<Problem | undefined> {
    const existing = this.problems.get(id);
    if (!existing || existing.deleted) {
      return undefined;
    }

    const updated: Problem = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.problems.set(id, updated);
    return updated;
  }

  async deleteProblem(id: string): Promise<boolean> {
    const existing = this.problems.get(id);
    if (!existing || existing.deleted) {
      return false;
    }

    const updated: Problem = {
      ...existing,
      deleted: true,
      updatedAt: new Date(),
    };

    this.problems.set(id, updated);
    return true;
  }

  async upsertProblems(problemsData: InsertProblem[]): Promise<ImportResult> {
    let added = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const problemData of problemsData) {
      try {
        const existing = this.problems.get(problemData.id);
        
        if (existing && !existing.deleted) {
          // Update existing problem, preserve status and notes if they exist
          const updatedProblem: Problem = {
            ...existing,
            title: problemData.title,
            difficulty: problemData.difficulty,
            tags: problemData.tags || [],
            link: problemData.link,
            slug: problemData.slug,
            searchText: problemData.searchText,
            updatedAt: new Date(),
            updatedFromCsv: true,
          };
          
          this.problems.set(problemData.id, updatedProblem);
          updated++;
        } else {
          // Create new problem
          const newProblem: Problem = {
            ...problemData,
            status: "Not Prepared",
            tags: problemData.tags || [],
            notes: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            updatedFromCsv: false,
            deleted: false,
          };
          
          this.problems.set(problemData.id, newProblem);
          added++;
        }
      } catch (error) {
        errors.push(`Failed to process problem ${problemData.id}: ${error}`);
        skipped++;
      }
    }

    return { added, updated, skipped, errors, warnings };
  }

  async getProblemStats(): Promise<ProblemStats> {
    const activeProblems = Array.from(this.problems.values()).filter(p => !p.deleted);
    const total = activeProblems.length;
    const prepared = activeProblems.filter(p => p.status === "Prepared").length;
    const inProgress = activeProblems.filter(p => p.status === "In Progress").length;
    const notPrepared = activeProblems.filter(p => p.status === "Not Prepared").length;
    const percentagePrepared = total > 0 ? Math.round((prepared / total) * 100) : 0;

    return { total, prepared, inProgress, notPrepared, percentagePrepared };
  }

  async getDifficultyStats(): Promise<DifficultyStats[]> {
    const activeProblems = Array.from(this.problems.values()).filter(p => !p.deleted);
    const stats = new Map<string, number>();

    for (const problem of activeProblems) {
      stats.set(problem.difficulty, (stats.get(problem.difficulty) || 0) + 1);
    }

    return Array.from(stats.entries()).map(([difficulty, count]) => ({ difficulty, count }));
  }

  async getTagStats(): Promise<TagStats[]> {
    const activeProblems = Array.from(this.problems.values()).filter(p => !p.deleted);
    const stats = new Map<string, number>();

    for (const problem of activeProblems) {
      for (const tag of problem.tags) {
        stats.set(tag, (stats.get(tag) || 0) + 1);
      }
    }

    return Array.from(stats.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 tags
  }

  checkEditKey(key: string): boolean {
    return key === this.editKey;
  }

  async exportProblems(): Promise<Problem[]> {
    return Array.from(this.problems.values()).filter(p => !p.deleted);
  }
}

export const storage = new MemStorage();
