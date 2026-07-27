// Repoints @v6y/core-logic at its compiled output, inside the runtime image only.
//
// For development the package resolves to TypeScript sources: package.json main
// is src/index.ts, and a few backend modules deep-import internals such as
// '@v6y/core-logic/src/core/PasswordUtils.ts'. The service images ship dist/ and
// no sources, so both forms have to be mapped onto the emitted JavaScript.
//
// The subpath patterns are what keep those deep imports working without editing a
// single import statement. Re-exporting PasswordUtils from the package index
// would be the conventional fix, but it pulls in bcrypt, a native addon, which
// would then enter the Next.js browser bundle graph through @v6y/ui-kit.
//
// Usage: node repoint-core-logic.cjs <path to core-logic/package.json>

const fs = require('fs');

const manifestPath = process.argv[2];

if (!manifestPath) {
    console.error('usage: node repoint-core-logic.cjs <path to package.json>');
    process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.main = 'dist/index.js';
manifest.exports = {
    '.': './dist/index.js',
    './src/*.ts': './dist/*.js',
    // Array fallback so a directory deep-import resolves to its compiled index.
    './src/*': ['./dist/*.js', './dist/*/index.js'],
    './package.json': './package.json',
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`repointed ${manifestPath} at dist/`);
