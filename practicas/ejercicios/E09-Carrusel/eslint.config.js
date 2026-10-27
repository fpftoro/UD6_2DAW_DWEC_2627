import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['playwright-report/', 'test-results/'] }, // informes de Playwright
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: 'error',
    },
  },
];
