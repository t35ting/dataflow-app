import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { storage } from './storage';

export async function loadLeetCodeData() {
  try {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'CSV - leetcode_problems_1755859869756.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('CSV file not found at:', csvPath);
      return;
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            if (results.errors.length > 0) {
              console.error('CSV parsing errors:', results.errors);
              return reject(new Error('CSV parsing failed'));
            }

            const rows = results.data as any[];
            console.log(`Parsed ${rows.length} LeetCode problems`);

            // Process and normalize the data
            const processedRows = rows.map(row => {
              const tags = row.Tags ? row.Tags.split(',').map((tag: string) => tag.trim()).sort() : [];
              const difficulty = normalizeDifficulty(row.Difficulty || '');
              const title = (row.Title || '').trim();
              const id = (row.ID || '').toString().trim();
              const link = (row.Link || '').trim();

              return {
                id,
                title,
                difficulty,
                tags,
                link,
                slug: createSlug(title),
                searchText: `${title} ${tags.join(' ')}`.toLowerCase(),
              };
            }).filter(row => row.id && row.title && row.link);

            // Import the data
            const result = await storage.upsertProblems(processedRows);
            console.log(`Import completed: Added ${result.added}, Updated ${result.updated}, Skipped ${result.skipped}`);
            
            resolve(result);
          } catch (error) {
            console.error('Data processing error:', error);
            reject(error);
          }
        },
        error: (error: any) => {
          console.error('CSV parsing error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Failed to load LeetCode data:', error);
    throw error;
  }
}

function normalizeDifficulty(difficulty: string): string {
  const normalized = difficulty.toLowerCase().trim();
  if (normalized === 'easy') return 'Easy';
  if (normalized === 'medium') return 'Medium';
  if (normalized === 'hard') return 'Hard';
  return 'Unknown';
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}