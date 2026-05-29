import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

export default [
    {
        name: 'eslint:recommended',
        ...eslint.configs.recommended,
    },

    ...tsEslint.configs.recommended,

    {
        name: 'analyzer:source',
        files: ['src/**/*.{js,mjs,ts,tsx}'],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir,
            },
        },
        rules: {
            'max-depth': ['error', 3],
            'max-nested-callbacks': ['error', 3],
            'max-params': ['error', 3],
            'max-lines': ['error', 1000],
            'max-lines-per-function': ['error', 200],
            'max-statements': ['error', 50],
        },
    },

    {
        name: 'analyzer:tests',
        files: ['src/**/__tests__/**/*-test.{ts,js}', 'src/**/*.test.{ts,js,tsx}'],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir,
            },
        },
        rules: {
            'max-lines-per-function': 'off',
            'max-lines': 'off',
        },
    },

    {
        name: 'prettier:config',
        ...eslintConfigPrettier,
    },

    {
        name: 'globals:setup',
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },

    {
        name: 'ignores',
        ignores: ['**/*.test.js', '*.d.ts', '**/*.d.ts', 'dist/**', 'node_modules/**'],
    },
];
