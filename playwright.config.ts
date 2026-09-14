import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const SANDBOX_CHROMIUM = '/opt/pw-browsers/chromium';
const chromiumPath =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  (existsSync(SANDBOX_CHROMIUM) ? SANDBOX_CHROMIUM : undefined);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm exec astro preview --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        // Resolve a browser in this order: an explicit PLAYWRIGHT_CHROMIUM_PATH,
        // then a sandbox-preinstalled binary if one exists, then Playwright's
        // own managed download. Keeps the suite runnable locally and in cloud
        // sessions without editing this file.
        ...(chromiumPath ? { launchOptions: { executablePath: chromiumPath } } : {}),
      },
    },
  ],
});
