#!/usr/bin/env node
// Generates a flat placeholder JPG/PNG at every path listed in
// docs/image-manifest.md. Run once now, and again only if that list changes.
// Real photography lands at these exact filenames later — nothing else in
// the codebase needs to change when that happens.
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = join(import.meta.dirname, '..');

// Brand values duplicated here rather than imported from tokens.css: this
// script runs outside the Astro/CSS pipeline, so it cannot resolve custom
// properties. Keep these in sync with src/styles/tokens.css by hand.
const MINT = '#eaf3ec';
const GREEN = '#1f5c3f';
const TERRA = '#c1552b';
const GOLD = '#d9a441';
const SOFT = '#5c6350';

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&apos;';
    }
  });
}

function placeholderSvg(width, height, caption) {
  const iconSize = Math.min(width, height) * 0.32;
  const iconX = width / 2 - iconSize / 2;
  const iconY = height / 2 - iconSize / 2 - height * 0.04;
  const scale = iconSize / 64;
  const fontSize = Math.max(12, Math.round(width * 0.013));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${MINT}"/>
  <g transform="translate(${iconX}, ${iconY}) scale(${scale})" opacity="0.18">
    <g fill="none" stroke="${GREEN}" stroke-width="4.2" stroke-linecap="round">
      <path d="M32 34 L32 52"/>
      <path d="M32 34 L16 16"/>
      <path d="M32 34 L44 14"/>
      <path d="M32 34 L48 30"/>
    </g>
    <circle cx="32" cy="34" r="4.6" fill="${GREEN}"/>
    <circle cx="16" cy="16" r="3.6" fill="${TERRA}"/>
    <circle cx="44" cy="14" r="3.6" fill="${GOLD}"/>
    <circle cx="48" cy="30" r="3.6" fill="${GREEN}"/>
  </g>
  <text x="50%" y="${height - Math.max(16, height * 0.04)}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" fill="${SOFT}">${escapeXml(caption)}</text>
</svg>`;
}

function heightFor(width, ratio) {
  const [w, h] = ratio;
  return Math.round((width * h) / w);
}

function series(dir, prefix, count, ratio, width, page, digits = 2) {
  const out = [];
  for (let i = 1; i <= count; i += 1) {
    const n = String(i).padStart(digits, '0');
    out.push({
      path: `public/images/${dir}/${prefix}${n}.jpg`,
      ratio,
      width,
      caption: `${page}, slide ${i}`,
    });
  }
  return out;
}

function productSeries(slug, count, page) {
  const out = [
    {
      path: `public/images/products/${slug}/hero.jpg`,
      ratio: [4, 3],
      width: 1000,
      caption: `${page} — hero`,
    },
  ];
  for (let i = 1; i <= count; i += 1) {
    const n = String(i).padStart(2, '0');
    out.push({
      path: `public/images/products/${slug}/${n}.jpg`,
      ratio: [4, 3],
      width: 1000,
      caption: page,
    });
  }
  return out;
}

const FIELD_NOTES_SLUGS = [
  'choosing-the-right-graft-tube-size',
  'humidity-and-vpd-during-rooting',
  'sanitation-between-propagation-batches',
  'reading-your-monitoring-dashboard',
  'setting-up-a-new-propagation-block',
];

const ENTRIES = [
  ...series('hero', 'hero-', 5, [16, 9], 1920, 'Homepage hero carousel'),
  ...series('process', 'process-', 6, [4, 3], 1200, 'Homepage propagation-journey carousel'),
  ...series('facility', 'facility-', 8, [4, 3], 1200, 'Homepage facilities-in-use carousel'),
  ...productSeries('grafting-tubes', 4, 'Grafting Tubes'),
  ...productSeries('grafting-clips', 4, 'Grafting Clips'),
  ...productSeries('nursery-consumables', 5, 'Nursery Consumables'),
  ...productSeries('propagation-systems', 5, 'Propagation Systems'),
  ...productSeries('sanitation', 4, 'Sanitation Products'),
  {
    path: 'public/images/products/monitoring/hero.jpg',
    ratio: [4, 3],
    width: 1000,
    caption: 'Propagation Monitoring — hero',
  },
  {
    path: 'public/images/products/monitoring/dashboard.png',
    ratio: [16, 10],
    width: 1200,
    caption: 'Propagation Monitoring — example dashboard',
  },
  {
    path: 'public/images/products/monitoring/01.jpg',
    ratio: [4, 3],
    width: 1000,
    caption: 'Propagation Monitoring',
  },
  {
    path: 'public/images/products/monitoring/02.jpg',
    ratio: [4, 3],
    width: 1000,
    caption: 'Propagation Monitoring',
  },
  {
    path: 'public/images/products/monitoring/03.jpg',
    ratio: [4, 3],
    width: 1000,
    caption: 'Propagation Monitoring',
  },
  ...productSeries('technical-services', 4, 'Technical Services'),
  { path: 'public/images/about/team-01.jpg', ratio: [4, 3], width: 1200, caption: 'About — team' },
  { path: 'public/images/about/team-02.jpg', ratio: [4, 3], width: 1200, caption: 'About — team' },
  {
    path: 'public/images/about/nairobi-hub.jpg',
    ratio: [4, 3],
    width: 1200,
    caption: 'About — Nairobi hub',
  },
  ...FIELD_NOTES_SLUGS.map((slug) => ({
    path: `public/images/field-notes/${slug}/cover.jpg`,
    ratio: [16, 9],
    width: 1200,
    caption: `Field Notes: ${slug}`,
  })),
  // Per-page share images (og:image). 1200x630 is the standard Open Graph
  // crop, distinct from any hero photo the page also carries. og-default.jpg
  // is hand-built brand art (scripts/generate-og-default.mjs), not part of
  // this list.
  ...[
    ['home', 'Home'],
    ['products', 'Products'],
    ['grafting-tubes', 'Grafting Tubes'],
    ['grafting-clips', 'Grafting Clips'],
    ['nursery-consumables', 'Nursery Consumables'],
    ['propagation-systems', 'Propagation Systems'],
    ['sanitation', 'Sanitation Products'],
    ['monitoring', 'Propagation Monitoring'],
    ['technical-services', 'Technical Services'],
    ['tools', 'Tools'],
    ['grafting-calculator', 'Grafting Calculator'],
    ['consumables-planner', 'Consumables Planner'],
    ['field-notes', 'Field Notes'],
    ['choosing-the-right-graft-tube-size', 'Choosing the Right Graft Tube Size'],
    ['humidity-and-vpd-during-rooting', 'Humidity and VPD During Rooting'],
    ['sanitation-between-propagation-batches', 'Sanitation Between Propagation Batches'],
    ['reading-your-monitoring-dashboard', 'Reading Your Monitoring Dashboard'],
    ['setting-up-a-new-propagation-block', 'Setting Up a New Propagation Block'],
    ['about', 'About'],
    ['contact', 'Contact'],
  ].map(([slug, page]) => ({
    path: `public/images/og/og-${slug}.jpg`,
    ratio: [40, 21],
    width: 1200,
    caption: `Share image — ${page}`,
  })),
];

async function main() {
  for (const entry of ENTRIES) {
    const height = heightFor(entry.width, entry.ratio);
    const svg = placeholderSvg(entry.width, height, entry.caption);
    const outPath = join(ROOT, entry.path);
    await mkdir(dirname(outPath), { recursive: true });
    const image = sharp(Buffer.from(svg));
    if (outPath.endsWith('.png')) {
      await image.png().toFile(outPath);
    } else {
      await image.jpeg({ quality: 78 }).toFile(outPath);
    }
    console.log(`wrote ${entry.path} (${entry.width}x${height})`);
  }
  console.log(`\n${ENTRIES.length} placeholders written.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
