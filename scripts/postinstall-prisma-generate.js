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

const schemaPath = path.resolve(__dirname, '../v6y-libs/core-logic/prisma/schema.prisma');

if (!existsSync(schemaPath)) {
    process.exit(0);
}

try {
    execSync('pnpm --filter @v6y/core-logic db:generate', {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..'),
    });
} catch {
    console.warn(
        '[postinstall] Prisma client generation failed or was skipped - run `pnpm --filter @v6y/core-logic db:generate` manually before starting the backend services.',
    );
}
