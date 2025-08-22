import { z } from 'zod';

export const csvValidationSchema = z.object({
  ID: z.string().min(1, "ID is required"),
  Title: z.string().min(1, "Title is required"),
  Difficulty: z.string().min(1, "Difficulty is required"),
  Tags: z.string(),
  Link: z.string().url("Invalid URL format"),
});

export const problemValidationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Unknown"]),
  tags: z.array(z.string()),
  link: z.string().url("Invalid URL format"),
  status: z.enum(["Not Prepared", "In Progress", "Prepared"]),
  notes: z.string().optional(),
});

export function validateProblemData(data: any) {
  try {
    return problemValidationSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map(e => e.message).join(', '));
    }
    throw error;
  }
}

export function validateCsvData(data: any[]) {
  const errors: string[] = [];
  const validRows: any[] = [];

  data.forEach((row, index) => {
    try {
      const validRow = csvValidationSchema.parse(row);
      validRows.push(validRow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(`Row ${index + 1}: ${error.errors.map(e => e.message).join(', ')}`);
      } else {
        errors.push(`Row ${index + 1}: Validation failed`);
      }
    }
  });

  return { validRows, errors };
}
