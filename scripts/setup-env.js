#!/usr/bin/env node

/**
 * One env file for the whole monorepo.
 *
 * - Creates the root .env from .env.template on first run (never overwrites it).
 * - Links that single .env into every app that needs its own local copy
 *   (backend services read ./.env via tsx --env-file, front apps read
 *   .env.local via Next.js' own convention), so there is exactly one file to
 *   edit instead of one per app.
 *
 * Symlinks are used so edits to the root .env show up everywhere immediately.
 * On platforms where symlinking isn't permitted (e.g. Windows without
 * Developer Mode), each app gets a plain copy instead. Those copies are not
 * refreshed on re-run (they're indistinguishable from a user-created file), so
 * after editing the root .env delete the app-level copies and re-run this
 * script to propagate the change.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const rootEnvTemplate = path.join(rootDir, '.env.template');
const rootEnv = path.join(rootDir, '.env');

const links = [
    'v6y-apps/bff/.env',
    'v6y-apps/bfb-main-analyzer/.env',
    'v6y-apps/bfb-static-auditor/.env',
    'v6y-apps/bfb-dynamic-auditor/.env',
    'v6y-apps/bfb-devops-auditor/.env',
    'v6y-apps/front/.env.local',
    'v6y-apps/front-bo/.env.local',
];

function ensureRootEnv() {
    if (fs.existsSync(rootEnv)) {
        return;
    }
    fs.copyFileSync(rootEnvTemplate, rootEnv);
    console.log('Created .env from .env.template - fill in your tokens/secrets there.');
}

function isLinkedToRootEnv(targetPath) {
    try {
        const stat = fs.lstatSync(targetPath);
        if (!stat.isSymbolicLink()) {
            return false;
        }
        const resolved = path.resolve(path.dirname(targetPath), fs.readlinkSync(targetPath));
        return resolved === rootEnv;
    } catch {
        return false;
    }
}

function linkEnv(relativeTarget) {
    const targetPath = path.join(rootDir, relativeTarget);
    const existing = fs.lstatSync(targetPath, { throwIfNoEntry: false });

    if (existing) {
        if (isLinkedToRootEnv(targetPath)) {
            return;
        }
        // A real, user-created file (or a broken/foreign symlink): don't clobber it.
        console.log(`Skipped ${relativeTarget} (already exists, not managed by setup-env).`);
        return;
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    const relativeSource = path.relative(path.dirname(targetPath), rootEnv);
    try {
        fs.symlinkSync(relativeSource, targetPath);
    } catch {
        fs.copyFileSync(rootEnv, targetPath);
        console.log(`Copied .env to ${relativeTarget} (symlinks unavailable on this platform).`);
        return;
    }
    console.log(`Linked ${relativeTarget} -> .env`);
}

ensureRootEnv();
for (const relativeTarget of links) {
    linkEnv(relativeTarget);
}
