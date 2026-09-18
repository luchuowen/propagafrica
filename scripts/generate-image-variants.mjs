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

// The carousel's three photo sets — the ones Carousel.astro's <picture>
// markup references.
const CAROUSEL_DIRS = ['hero', 'process', 'facility'];
// The homepage Product-families grid reuses each family's full-size page
// hero photo as a small thumbnail card with no responsive source at all
// (the Sep-15 image-performance commit's own "remaining opportunity" note,
// picked up by the Sep-18 pre-launch perf audit: Lighthouse's image-delivery
// insight flagged grafting-tubes/hero.jpg specifically — a 1000x750 file
// serving a 613x459 card). Every family folder's own hero.jpg/hero.png gets
// the same WebP + 640w treatment as the carousels; index.astro's product
// grid picks up the small variant below.
const PRODUCT_HERO_NAMES = ['hero.jpg', 'hero.jpeg', 'hero.png'];
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

async function collectProductHeroImages(productsRoot) {
  let familyDirs;
  try {
    familyDirs = await readdir(productsRoot, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of familyDirs) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(productsRoot, entry.name);
    for (const name of PRODUCT_HERO_NAMES) {
      const candidate = path.join(dir, name);
      try {
        await stat(candidate);
        files.push(candidate);
      } catch {
        // this family doesn't use this filename — fine, try the next
      }
    }
  }
  return files;
}

export async function generateImageVariants(imagesRoot) {
  const carouselTargets = (
    await Promise.all(CAROUSEL_DIRS.map((name) => collectImages(path.join(imagesRoot, name))))
  ).flat();
  const productHeroTargets = await collectProductHeroImages(path.join(imagesRoot, 'products'));
  const targets = [...carouselTargets, ...productHeroTargets];

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
