import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    {
        files: ['src/**/*.js', 'src/**/*.mjs'],
        ignores: ['**/*.test.js'],
        rules: {
            'max-depth': ['error', 5],
            'max-nested-callbacks': ['error', 5],
            'max-params': ['error', 3],
            /*
            Some people consider large files a code smell. Large files tend to do a lot of things and can make it hard following what’s going.
            While there is not an objective maximum number of lines considered acceptable in a file, most people would agree it should not be in the thousands.
            Recommendations usually range from 100 to 500 lines.
             */
            'max-lines': ['error', 1500], // per file
            'max-lines-per-function': ['error', 200], // per function
            'max-statements': ['error', 50], // per function
        },
    },
    eslintPluginPrettierRecommended,
];
