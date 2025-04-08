import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ['next/core-web-vitals', 'next/typescript'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    }),
    // Special rules for test files
    {
        files: ['**/__tests__/**/*-test.ts', '**/__tests__/**/*-test.js', '**/*.test.{js,ts,tsx}'],
        rules: {
            'max-lines-per-function': 'off',
        },
    },
];

export default eslintConfig;
