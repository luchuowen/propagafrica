import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Every colour token pair the site actually puts together, checked against
// WCAG 2.1 AA. The token values are read from tokens.css rather than copied
// here, so changing a token is what this test is measuring.

const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

function token(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`));
  if (!match?.[1]) throw new Error(`token --${name} not found in tokens.css`);
  return match[1];
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(full.slice(i, i + 2), 16)));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

const AA_NORMAL = 4.5;
const AA_LARGE = 3;

describe('colour token contrast', () => {
  const paper = () => token('paper');

  it.each([
    ['ink on paper', 'ink', AA_NORMAL],
    ['ink-soft on paper', 'ink-soft', AA_NORMAL],
    ['green on paper', 'green', AA_NORMAL],
    ['signal-ink on paper', 'signal-ink', AA_NORMAL],
  ])('%s clears AA', (_label, name, threshold) => {
    expect(contrast(token(name as string), paper())).toBeGreaterThanOrEqual(threshold as number);
  });

  it('paper on green clears AA — the only reversed ground on the site', () => {
    expect(contrast(token('paper'), token('green'))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('the brand --signal is used as a graphic colour only, and is documented as such', () => {
    // It does not clear AA as small text. That is why --signal-ink exists.
    expect(contrast(token('signal'), paper())).toBeLessThan(AA_NORMAL);
    expect(contrast(token('signal'), paper())).toBeGreaterThanOrEqual(AA_LARGE);
    expect(css).toMatch(/graphic colour/);
  });

  it('--rule is a hairline, never text', () => {
    expect(contrast(token('rule'), paper())).toBeLessThan(AA_LARGE);
  });
});
