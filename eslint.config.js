// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  {
    // functions/ is a standalone deployable package with its own tsconfig and node_modules
    // (firebase-admin, firebase-functions) — session 6, see .factory/decisions/session-6.md.
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'functions/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      // Astro components frequently use inline scripts with browser globals.
      'no-undef': 'off',
    },
  },
);
