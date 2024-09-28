import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    {
        files: ['src/**/*.js', 'src/**/*.mjs'],
        ignores: ['**/*.test.js'],
        rules: {
            'max-depth': ['error', 3],
            'max-nested-callbacks': ['error', 3],
            'max-params': ['error', 3],
            /*
            Some people consider large files a code smell. Large files tend to do a lot of things and can make it hard following what’s going.
            While there is not an objective maximum number of lines considered acceptable in a file, most people would agree it should not be in the thousands.
            Recommendations usually range from 100 to 500 lines.
             */
            'max-lines': ['error', 1000], // per file
            'max-lines-per-function': ['error', 100], // per function
            'max-statements': ['error', 50], // per function
        },
    },
    eslintPluginPrettierRecommended,
];
