#!/usr/bin/env node
// Generates the single branded default share image at
// /public/images/og/og-default.jpg (1200x630) — logo, wordmark, brand
// palette. Distinct from generate-placeholders.mjs: this is finished art,
// not a stand-in for real photography, so it isn't part of that script's
// list. Re-run only if the mark or wordmark lockup changes.
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = join(import.meta.dirname, '..');
const OUT_PATH = join(ROOT, 'public/images/og/og-default.jpg');

// Duplicated from src/styles/tokens.css — this script runs outside the
// Astro/CSS pipeline and cannot resolve custom properties. Keep in sync.
const PAPER = '#fbf6ee';
const INK = '#20241a';
const GREEN = '#1f5c3f';
const SOFT = '#5c6350';
const TERRA = '#c1552b';

async function main() {
  const markSvg = await readFile(join(ROOT, 'public/images/logo/mark.svg'), 'utf8');
  const markInner = markSvg
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();

  const width = 1200;
  const height = 630;
  const markScale = 3.9;
  const markPx = 64 * markScale;
  const markX = width / 2 - markPx / 2;
  const markY = 168;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${PAPER}"/>
  <g transform="translate(${markX}, ${markY}) scale(${markScale})">
    ${markInner}
  </g>
  <text x="50%" y="452" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="64" letter-spacing="-1">
    <tspan fill="${INK}">Propag</tspan><tspan fill="${GREEN}">Africa</tspan>
  </text>
  <text x="50%" y="492" text-anchor="middle" font-family="'Courier New', Courier, monospace" font-size="17" letter-spacing="7" fill="${SOFT}">TECHNOLOGIES</text>
  <rect x="${width / 2 - 60}" y="524" width="120" height="2" fill="${TERRA}"/>
</svg>`;

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(OUT_PATH);
  console.log(`wrote public/images/og/og-default.jpg (${width}x${height})`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
