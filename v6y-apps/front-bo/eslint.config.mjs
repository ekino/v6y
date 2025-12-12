import eslintConfigPrettier from 'eslint-config-prettier';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/refs': 'off',
        },
    },
    // Special rules for test files
    {
        files: ['**/__tests__/**/*-test.ts', '**/__tests__/**/*-test.js', '**/*.test.{js,ts,tsx}'],
        rules: {
            'max-lines-per-function': 'off',
        },
    },
    eslintConfigPrettier,
];

export default eslintConfig;
