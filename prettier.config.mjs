import PrettierImportConfig from '@trivago/prettier-plugin-sort-imports';

/** @type {import("prettier").Config} */
const config = {
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    printWidth: 100,
    plugins: [PrettierImportConfig],
    importOrder: [
        '^@v6y/(.*)$',      // Packages internes du monorepo
        '^@ui/(.*)$',
        '^@core/(.*)$',
        '^@server/(.*)$',
        '^[./]',            // Imports relatifs
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};

export default config;
