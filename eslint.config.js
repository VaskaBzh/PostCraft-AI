import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import eslintReact from '@eslint-react/eslint-plugin'
import importX from 'eslint-plugin-import-x'
import unicorn from 'eslint-plugin-unicorn'

export default defineConfig([
  globalIgnores(['.next', 'dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'import-x/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
        },
      ],
      'import-x/no-duplicates': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...eslintReact.configs['recommended'],
  },
  {
    plugins: { unicorn },
    rules: {
      'unicorn/prefer-string-slice': 'warn',
      'unicorn/no-array-for-each': 'warn',
      'unicorn/prefer-includes': 'warn',
      'unicorn/no-lonely-if': 'warn',
      'unicorn/prefer-logical-operator-over-ternary': 'warn',
      'unicorn/no-negated-condition': 'warn',
    },
  },
  prettier,
])
