#!/usr/bin/env node

/**
 * Safe cleanup script to terminate orphaned dev watchers and free all dev ports.
 * This prevents EADDRINUSE errors when starting a fresh dev session.
 *
 * Ports freed:
 * - 4001: BFF
 * - 4002: Main Analyzer (default)
 * - 4003: Static Auditor
 * - 4004: Dynamic Auditor
 * - 4005: DevOps Auditor
 * - 4006: Main Analyzer (alt)
 * - 4009: Main Analyzer (env override)
 * - 3000: Front
 * - 3001: Front BO
 */

const { execSync } = require('child_process');
const path = require('path');

const patterns = [
  'v6y-apps/bff/node_modules/.bin/../tsx/dist/cli.mjs watch',
  'v6y-apps/bfb-main-analyzer/node_modules/.bin/../tsx/dist/cli.mjs watch',
  'v6y-apps/bfb-static-auditor/node_modules/.bin/../tsx/dist/cli.mjs watch',
  'v6y-apps/bfb-dynamic-auditor/node_modules/.bin/../tsx/dist/cli.mjs watch',
  'v6y-apps/bfb-devops-auditor/node_modules/.bin/../tsx/dist/cli.mjs watch',
  'v6y-apps/front/node_modules/.bin/../next/dist/bin/next dev',
  'v6y-apps/front-bo/node_modules/.bin/../@refinedev/cli/dist/cli.cjs dev',
];

const ports = [4001, 4002, 4003, 4004, 4005, 4006, 4009, 3000, 3001];

console.log('🧹 Stopping dev watchers and freeing ports...\n');

// Kill each pattern
patterns.forEach((pattern) => {
  try {
    // Try soft kill first
    execSync(`pgrep -f "${pattern}" | xargs kill 2>/dev/null || true`, {
      stdio: 'pipe',
    });
  } catch (e) {
    // Ignore errors
  }
});

// Wait a moment
setTimeout(() => {
  // Force kill any remaining
  patterns.forEach((pattern) => {
    try {
      execSync(`pgrep -f "${pattern}" | xargs kill -9 2>/dev/null || true`, {
        stdio: 'pipe',
      });
    } catch (e) {
      // Ignore errors
    }
  });

  // Verify ports are free
  console.log('Port status:');
  let allFree = true;
  ports.forEach((port) => {
    try {
      execSync(`lsof -ti tcp:${port} >/dev/null 2>&1`);
      console.log(`  ❌ Port ${port} is still in use`);
      allFree = false;
    } catch (e) {
      console.log(`  ✓ Port ${port} is free`);
    }
  });

  console.log();
  if (allFree) {
    console.log('✅ All dev ports are free! Safe to run: pnpm start:dev:all\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some ports are still in use. You may need to manually kill processes.\n');
    process.exit(1);
  }
}, 1000);
