import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    // Rules tests talk to the Firestore emulator and can take longer to spin up than a plain
    // unit test.
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
