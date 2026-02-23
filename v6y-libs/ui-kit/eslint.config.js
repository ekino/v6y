// @ts-check
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        name: 'ignores',
        ignores: ['dist', 'coverage', 'node_modules/**'],
    },

    {
        name: 'eslint:js',
        files: ['**/*.{ts,tsx}'],
        ...js.configs.recommended,
    },

    ...tseslint.configs.recommended,

    {
        name: 'ui-kit:react',
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },

    {
        name: 'ui-kit:tests',
        files: ['**/__tests__/**/*-test.{ts,tsx}', '**/__tests__/**/*-test.js', '**/*.test.{ts,tsx,js}'],
        rules: {
            'max-lines-per-function': 'off',
        },
    },

    {
        name: 'prettier:config',
        ...eslintConfigPrettier,
    },
];
