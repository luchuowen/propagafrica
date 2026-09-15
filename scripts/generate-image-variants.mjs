#!/usr/bin/env node
// Runs after `astro build` (wired in astro.config.mjs via the astro:build:done
// hook) and generates the WebP + downscaled variants the carousel's <picture>
// markup references. It operates on the build OUTPUT (dist/images/...), never
// on public/images/ — the "drop a replacement photo at this exact path, no
// code change needed" contract in docs/image-manifest.md governs the source
// JPGs/PNGs only, and nothing here touches them.
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Only the carousel's three photo sets — the ones Carousel.astro's <picture>
// markup actually references. Product/about photography still ships as
// plain JPGs (a separate, larger change per the Sep-15 image-performance
// commit's own "remaining opportunity" note).
const CAROUSEL_DIRS = ['hero', 'process', 'facility'];
const SMALL_WIDTH = 640;
const QUALITY = 78;

async function collectImages(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    if (entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

async function processFile(file) {
  const ext = path.extname(file);
  const base = file.slice(0, -ext.length);
  const isPng = /\.png$/i.test(ext);
  const source = sharp(file);
  const meta = await source.metadata();
  const width = meta.width ?? 0;

  const jobs = [sharp(file).webp({ quality: QUALITY }).toFile(`${base}.webp`)];

  if (width > SMALL_WIDTH) {
    jobs.push(
      sharp(file)
        .resize({ width: SMALL_WIDTH })
        .webp({ quality: QUALITY })
        .toFile(`${base}-${SMALL_WIDTH}.webp`),
    );
    jobs.push(
      isPng
        ? sharp(file)
            .resize({ width: SMALL_WIDTH })
            .png({ compressionLevel: 9 })
            .toFile(`${base}-${SMALL_WIDTH}${ext}`)
        : sharp(file)
            .resize({ width: SMALL_WIDTH })
            .jpeg({ quality: QUALITY, mozjpeg: true })
            .toFile(`${base}-${SMALL_WIDTH}${ext}`),
    );
  }

  await Promise.all(jobs);
}

export async function generateImageVariants(imagesRoot) {
  const targets = (
    await Promise.all(CAROUSEL_DIRS.map((name) => collectImages(path.join(imagesRoot, name))))
  ).flat();

  if (targets.length === 0) return;
  await Promise.all(targets.map(processFile));
  console.log(
    `[image-variants] generated WebP + ${SMALL_WIDTH}w variants for ${targets.length} photos`,
  );
}

// Allow running standalone: node scripts/generate-image-variants.mjs [dist dir]
if (import.meta.url === `file://${process.argv[1]}`) {
  const distDir = process.argv[2] ?? path.join(process.cwd(), 'dist');
  const exists = await stat(distDir).catch(() => null);
  if (!exists) {
    console.error(`[image-variants] ${distDir} does not exist — run astro build first`);
    process.exit(1);
  }
  await generateImageVariants(path.join(distDir, 'images'));
}
