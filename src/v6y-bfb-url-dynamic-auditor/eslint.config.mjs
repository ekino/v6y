import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tsEslint from 'typescript-eslint';

export default [
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    {
        files: ['src/**/*.js', 'src/**/*.mjs', 'src/**/*.tsx', 'src/**/*.ts'],
        ignores: ['**/*.test.js', '*.d.ts'],
        rules: {
            'max-depth': ['error', 3],
            'max-nested-callbacks': ['error', 3],
            'max-params': ['error', 3],
            'max-lines': ['error', 1000], // per file
            'max-lines-per-function': ['error', 200], // per function
            'max-statements': ['error', 50], // per function
        },
    },
    eslintPluginPrettierRecommended,
];
