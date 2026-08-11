import fs from 'fs';
import csv from 'csv-parser';
import { domainToSlug } from './slugify';

export interface ParsedDomain {
  name: string;
  slug: string;
}

export async function parseCSV(filePath: string): Promise<ParsedDomain[]> {
  return new Promise((resolve, reject) => {
    const results: ParsedDomain[] = [];
    const seenSlugs = new Set<string>();

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        const rawName = (row['domain'] || row['roadmap_name'] || Object.values(row)[0] || '').trim();
        if (!rawName) return;

        const name = rawName
          .split(' ')
          .map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : '')
          .join(' ');

        const slug = domainToSlug(name);
        if (!slug || seenSlugs.has(slug)) return;

        seenSlugs.add(slug);
        results.push({ name, slug });
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}
