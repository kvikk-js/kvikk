import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: ['build/**/*.js', 'pages/*', 'components/*', 'layouts/*'],
  },
  eslintPluginPrettier,
];
