// Repoints workspace libraries (@v6y/core-logic, @v6y/notifications) at their
// compiled output, inside the runtime image only.
//
// For development each package resolves to TypeScript sources: package.json main
// is src/index.ts, and a few backend modules deep-import internals such as
// '@v6y/core-logic/src/core/PasswordUtils.ts'. The service images ship dist/ and
// no sources, so both forms have to be mapped onto the emitted JavaScript.
//
// The subpath patterns are what keep those deep imports working without editing a
// single import statement. Re-exporting PasswordUtils from the package index
// would be the conventional fix, but it pulls in bcrypt, a native addon, which
// would then enter the Next.js browser bundle graph through @v6y/ui-kit.
//
// Referenced only from v6y-config/Dockerfile, so knip cannot see the usage; it is
// listed in knip.json "ignore" to keep knip:ci green.
//
// Usage: node repoint-workspace-libs.cjs <path to package.json> [<path> ...]

const fs = require('fs');

const manifestPaths = process.argv.slice(2);

if (!manifestPaths.length) {
    console.error('usage: node repoint-workspace-libs.cjs <path to package.json> [<path> ...]');
    process.exit(1);
}

for (const manifestPath of manifestPaths) {
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
}
