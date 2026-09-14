#!/usr/bin/env node
// Generates every favicon/app-icon raster from public/images/logo/mark.svg
// (the light-tone brand mark) plus a matching /favicon.svg source. Run again
// only if the mark is redrawn — nothing else in the codebase needs to change.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = join(import.meta.dirname, '..');
const MARK_PATH = join(ROOT, 'public/images/logo/mark.svg');

// Duplicated from src/styles/tokens.css (this script runs outside the
// Astro/CSS pipeline and cannot resolve custom properties) — keep in sync.
const PAPER = '#fbf6ee';

async function main() {
  const mark = await readFile(MARK_PATH, 'utf8');
  const markInner = mark.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="PropagAfrica Technologies">
  <rect width="64" height="64" fill="${PAPER}"/>
  ${markInner.trim()}
</svg>
`;
  await writeFile(join(ROOT, 'public/favicon.svg'), faviconSvg);
  console.log('wrote public/favicon.svg');

  const pngTargets = [
    { path: 'public/favicon-16.png', size: 16 },
    { path: 'public/favicon-32.png', size: 32 },
    { path: 'public/apple-touch-icon.png', size: 180 },
    { path: 'public/icon-192.png', size: 192 },
    { path: 'public/icon-512.png', size: 512 },
  ];

  const pngBuffers = {};
  for (const target of pngTargets) {
    const buffer = await sharp(Buffer.from(faviconSvg))
      .resize(target.size, target.size)
      .png()
      .toBuffer();
    pngBuffers[target.size] = buffer;
    await writeFile(join(ROOT, target.path), buffer);
    console.log(`wrote ${target.path} (${target.size}x${target.size})`);
  }

  // Minimal ICO container: header + one directory entry per embedded PNG.
  // Modern browsers and Windows (Vista+) accept PNG-compressed ICO frames
  // directly, so no BMP re-encoding is needed.
  const icoSizes = [16, 32];
  const icoImages = icoSizes.map((size) => pngBuffers[size]);
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * icoImages.length;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(icoImages.length, 4);

  const dirEntries = [];
  for (const [index, size] of icoSizes.entries()) {
    const image = icoImages[index];
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(image.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.length;
    dirEntries.push(entry);
  }

  const ico = Buffer.concat([header, ...dirEntries, ...icoImages]);
  await writeFile(join(ROOT, 'public/favicon.ico'), ico);
  console.log(`wrote public/favicon.ico (${icoSizes.join('+')}px)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
