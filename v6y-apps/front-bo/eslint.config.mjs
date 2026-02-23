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
        name: 'front-bo:source',
        files: ['src/**/*.{js,mjs,ts,tsx}'],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },

    {
        name: 'front-bo:config',
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
        name: 'front-bo:tests',
        files: ['**/__tests__/**/*-test.{ts,tsx}', '**/__tests__/**/*-test.js', '**/*.test.{js,ts,tsx}', 'test-mocks/**', 'setupTests.tsx'],
        rules: {
            'max-lines-per-function': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },

    {
        name: 'prettier:config',
        ...eslintConfigPrettier,
    },

    {
        name: 'ignores',
        ignores: ['**/*.test.js', '*.d.ts', '**/*.d.ts', 'dist/**', 'node_modules/**', '.next/**', 'storybook-static/**', 'coverage/**'],
    },
];
