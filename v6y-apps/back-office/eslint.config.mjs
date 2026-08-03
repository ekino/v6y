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
        name: 'back-office:source',
        files: ['src/**/*.{js,mjs,ts,tsx}'],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },

    {
        name: 'back-office:config',
        files: ['*.config.{js,mjs,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },

    {
        name: 'back-office:tests',
        files: ['**/__tests__/**/*-test.{ts,tsx}', '**/*.test.{js,ts,tsx}'],
        rules: {
            'max-lines-per-function': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'react/display-name': 'off',
        },
    },

    {
        name: 'prettier:config',
        ...eslintConfigPrettier,
    },

    {
        name: 'ignores',
        ignores: ['**/*.test.js', '*.d.ts', '**/*.d.ts', 'dist/**', 'node_modules/**', '.next/**', 'coverage/**'],
    },
];
