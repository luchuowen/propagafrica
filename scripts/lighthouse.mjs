#!/usr/bin/env node
// Lighthouse mobile + desktop audit of the four routes named in the launch
// checklist: Home, one product family page, one tool page, one Field Notes
// article. Run against `astro preview`; started and stopped by this script.
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { existsSync } from 'node:fs';
import lighthouse, { desktopConfig } from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const ROUTES = [
  '/',
  '/products/grafting-tubes',
  '/tools/grafting-calculator',
  '/field-notes/choosing-the-right-graft-tube-size',
];
const FORM_FACTORS = ['mobile', 'desktop'];

const THRESHOLDS = {
  performance: 95,
  accessibility: 100,
  'best-practices': 95,
  seo: 95,
};

const PORT = 4399;
const ORIGIN = `http://localhost:${PORT}`;
const SANDBOX_CHROMIUM = '/opt/pw-browsers/chromium';
const chromePath =
  process.env.LIGHTHOUSE_CHROME_PATH ??
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  (existsSync(SANDBOX_CHROMIUM) ? SANDBOX_CHROMIUM : undefined);

async function waitForServer(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await sleep(500);
  }
  throw new Error(`preview server did not start at ${url}`);
}

const preview = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORT)], {
  stdio: 'ignore',
});

let failed = false;
let chrome;
try {
  await waitForServer(ORIGIN);
  chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  });

  for (const route of ROUTES) {
    for (const formFactor of FORM_FACTORS) {
      const runnerResult = await lighthouse(
        `${ORIGIN}${route}`,
        { port: chrome.port, output: 'json', logLevel: 'error' },
        formFactor === 'desktop' ? desktopConfig : undefined,
      );
      const categories = runnerResult.lhr.categories;
      const line = [];
      for (const [key, min] of Object.entries(THRESHOLDS)) {
        const score = Math.round((categories[key]?.score ?? 0) * 100);
        line.push(`${key}=${score}`);
        if (score < min) {
          failed = true;
          console.error(`FAIL ${route} [${formFactor}]: ${key} ${score} < ${min}`);
        }
      }
      console.log(`${route} [${formFactor}]  ${line.join('  ')}`);
    }
  }
} finally {
  await chrome?.kill();
  preview.kill();
}

process.exit(failed ? 1 : 0);
