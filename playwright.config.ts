import { defineConfig, devices } from '@playwright/test';

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
  webServer: [
    {
      command: 'pnpm exec astro preview --port 4321',
      url: 'http://localhost:4321',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      // The tools' components aren't mounted by any page yet (session 8
      // does that) — this serves their fixture harness instead. See
      // tests/tools/fixtures/serve.mjs and .factory/decisions/session-4.md.
      command: 'node tests/tools/fixtures/serve.mjs',
      url: 'http://localhost:4322/sleeve-selector.html',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        // Pre-installed browser in this environment; avoids a version-pinned
        // download mismatch with @playwright/test's bundled build id.
        launchOptions: { executablePath: '/opt/pw-browsers/chromium' },
      },
    },
    {
      name: 'tools',
      testDir: './tests/tools',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4322',
        launchOptions: { executablePath: '/opt/pw-browsers/chromium' },
      },
    },
  ],
});
