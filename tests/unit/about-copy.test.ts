import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Hard rule on /about (CLAUDE.md § Invariants, no-founding-date): nothing on
// the page may state when the company was founded, how long it has traded,
// or how many people it employs. The manifest gate is a regex over source
// copy and a rephrase can dodge it, so this test greps the actually built
// HTML instead.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BANNED = ['founded', 'established', 'since 20', 'years of experience'];

describe('/about hard rule: no founding date, age or headcount language', () => {
  let html = '';

  beforeAll(() => {
    const outDir = mkdtempSync(join(tmpdir(), 'pa-about-build-'));
    try {
      execFileSync('pnpm', ['exec', 'astro', 'build', '--outDir', outDir], {
        cwd: repoRoot,
        stdio: 'pipe',
      });
      html = readFileSync(join(outDir, 'about', 'index.html'), 'utf-8').toLowerCase();
    } finally {
      rmSync(outDir, { recursive: true, force: true });
    }
  }, 180_000);

  it.each(BANNED)('does not contain "%s"', (needle) => {
    expect(html).not.toContain(needle);
  });
});
