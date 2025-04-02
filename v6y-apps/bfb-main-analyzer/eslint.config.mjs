import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default [
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    {
        files: ['src/**/*.js', 'src/**/*.mjs', 'src/**/*.tsx', 'src/**/*.ts'],
        rules: {
            'max-depth': ['error', 3],
            'max-nested-callbacks': ['error', 3],
            'max-params': ['error', 3],
            'max-lines': ['error', 1000], // per file
            'max-lines-per-function': ['error', 200], // per function
            'max-statements': ['error', 50], // per function
        },
    },
    // Special rules for test files
    {
        files: ['src/**/__tests__/**/*-test.ts', 'src/**/__tests__/**/*-test.js', 'src/**/*.test.{js,ts,tsx}'],
        rules: {
            'max-lines-per-function': 'off',
        },
    },
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        ignores: ['**/*.test.js', '*.d.ts', '**/*.d.ts', 'dist/**'],
    },
];
