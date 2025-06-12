import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export function readCsvData(filePath: string): Record<string, string>[] {
  // Ensure the path is absolute
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}
