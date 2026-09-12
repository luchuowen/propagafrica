import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(process.cwd(), 'src/data/field-notes');

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  const block = match?.[1];
  if (!block) throw new Error('missing front matter block');
  const fields: Record<string, string> = {};
  for (const line of block.split('\n')) {
    const field = line.match(/^(\w+):\s*(.*)$/);
    const key = field?.[1];
    const value = field?.[2];
    if (key !== undefined && value !== undefined) fields[key] = value.trim();
  }
  return fields;
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.md'));
const articles = files.map((f) => parseFrontmatter(readFileSync(join(DIR, f), 'utf-8')));

describe('field notes', () => {
  it('has exactly five articles', () => {
    expect(articles.length).toBe(5);
  });

  it('gives every article a unique slug', () => {
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
