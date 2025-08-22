import Papa from 'papaparse';
import type { CsvRow, ValidationReport } from '@shared/schema';

export function parseCsvFile(file: File): Promise<{ rows: any[]; headers: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          return;
        }

        const headers = results.meta.fields || [];
        const requiredHeaders = ['ID', 'Title', 'Difficulty', 'Tags', 'Link'];
        
        // Check if all required headers are present
        const missingHeaders = requiredHeaders.filter(header => 
          !headers.some(h => h.toLowerCase() === header.toLowerCase())
        );

        if (missingHeaders.length > 0) {
          reject(new Error(`Missing required columns: ${missingHeaders.join(', ')}`));
          return;
        }

        resolve({
          rows: results.data as any[],
          headers
        });
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
}

export function validateCsv(rows: any[]): ValidationReport {
  const report: ValidationReport = {
    rowsOk: 0,
    rowsWithWarnings: 0,
    rowsWithErrors: 0,
    errors: [],
    warnings: [],
  };

  rows.forEach((row, index) => {
    let hasError = false;
    let hasWarning = false;

    // Validate ID
    if (!row.ID && !row.id) {
      report.errors.push({
        row: index + 1,
        field: 'ID',
        message: 'ID is required'
      });
      hasError = true;
    }

    // Validate Title
    if (!row.Title && !row.title) {
      report.errors.push({
        row: index + 1,
        field: 'Title',
        message: 'Title is required'
      });
      hasError = true;
    }

    // Validate Difficulty
    const difficulty = row.Difficulty || row.difficulty;
    if (!difficulty) {
      report.errors.push({
        row: index + 1,
        field: 'Difficulty',
        message: 'Difficulty is required'
      });
      hasError = true;
    } else {
      const normalizedDifficulty = difficulty.toLowerCase().trim();
      if (!['easy', 'medium', 'hard'].includes(normalizedDifficulty)) {
        report.warnings.push({
          row: index + 1,
          field: 'Difficulty',
          message: `Unrecognized difficulty "${difficulty}"`
        });
        hasWarning = true;
      }
    }

    // Validate Link
    const link = row.Link || row.link;
    if (!link) {
      report.errors.push({
        row: index + 1,
        field: 'Link',
        message: 'Link is required'
      });
      hasError = true;
    } else {
      try {
        new URL(link);
      } catch {
        report.errors.push({
          row: index + 1,
          field: 'Link',
          message: 'Invalid URL format'
        });
        hasError = true;
      }
    }

    // Count row status
    if (hasError) {
      report.rowsWithErrors++;
    } else if (hasWarning) {
      report.rowsWithWarnings++;
    } else {
      report.rowsOk++;
    }
  });

  return report;
}

export function normalizeCsvRow(row: any): any {
  // Normalize field names to lowercase
  const normalized: any = {};
  
  Object.keys(row).forEach(key => {
    const lowerKey = key.toLowerCase();
    normalized[lowerKey] = row[key];
  });

  // Map to expected field names
  const result = {
    id: (normalized.id || '').toString().trim(),
    title: (normalized.title || '').trim(),
    difficulty: normalizeDifficulty(normalized.difficulty || ''),
    tags: normalizeTags(normalized.tags || ''),
    link: (normalized.link || '').trim(),
  };

  // Add computed fields
  return {
    ...result,
    slug: createSlug(result.title),
    searchText: `${result.title} ${result.tags.join(' ')}`.toLowerCase(),
  };
}

function normalizeDifficulty(difficulty: string): string {
  const normalized = difficulty.toLowerCase().trim();
  if (normalized === 'easy') return 'Easy';
  if (normalized === 'medium' || normalized === 'med') return 'Medium';
  if (normalized === 'hard') return 'Hard';
  return 'Unknown';
}

function normalizeTags(tagsString: string): string[] {
  if (!tagsString) return [];
  
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
