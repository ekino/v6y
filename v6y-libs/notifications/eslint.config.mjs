import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default [
    {
        name: 'eslint:recommended',
        ...eslint.configs.recommended,
    },

    ...tsEslint.configs.recommended,

    {
        name: 'analyzer:source',
        files: ['src/**/*.{js,mjs,ts,tsx}'],
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
