#!/usr/bin/env node

/**
 * Generates the Prisma client after `pnpm install`, so a fresh clone doesn't
 * fail the first time an app imports @v6y/core-logic (the generated client
 * doesn't exist until `prisma generate` has run once).
 *
 * Guarded to a no-op when the schema isn't present yet: the Docker build
 * installs dependencies before the Prisma schema is copied into the image
 * (see v6y-config/Dockerfile), and running this during that install would
 * break the build. Also non-fatal on any other failure - `pnpm db:generate`
 * remains the explicit fallback documented in the README.
 */

const { existsSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const coreLogicDir = path.join(rootDir, 'v6y-libs/core-logic');
const schemaPath = path.join(coreLogicDir, 'prisma/schema.prisma');

if (!existsSync(schemaPath)) {
    process.exit(0);
}

// Skip when the client is already generated (e.g. `pnpm add <pkg>` on an
// existing checkout) so the full generation only runs on a fresh clone. The
// generated client lives in a .prisma/client dir next to @prisma/client, whose
// pnpm-hashed path we locate by resolving the package itself.
function isPrismaClientGenerated() {
    try {
        const entry = require.resolve('@prisma/client', { paths: [coreLogicDir] });
        const nodeModulesDir = path.resolve(path.dirname(entry), '../..');
        return existsSync(path.join(nodeModulesDir, '.prisma/client/index.js'));
    } catch {
        return false;
    }
}

if (isPrismaClientGenerated()) {
    process.exit(0);
}

try {
    execSync('pnpm --filter @v6y/core-logic db:generate', {
        stdio: 'inherit',
        cwd: rootDir,
    });
} catch {
    console.warn(
        '[postinstall] Prisma client generation failed or was skipped - run `pnpm --filter @v6y/core-logic db:generate` manually before starting the backend services.',
    );
}
