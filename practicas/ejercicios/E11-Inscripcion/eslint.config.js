import js from '@eslint/js';
import globals from 'globals';

export default [
  // La documentación generada con npm run docs y los informes de Playwright no se revisan
  { ignores: ['docs/', 'playwright-report/', 'test-results/'] },
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
