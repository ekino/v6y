#!/usr/bin/env node
/**
 * Prisma Migration Runner
 * Usage: npm run prisma:migrate (from core-logic package)
 * 
 * This script runs all raw SQL migrations in sequence
 * It should be called during Docker initialization or application startup
 */

import { runMigrations, isMigrationRun } from '../src/database/MigrationRunner.ts';
import { initializePrisma, disconnectPrisma } from '../src/database/PrismaClient.ts';
import AppLogger from '../src/core/AppLogger.ts';

const logger = AppLogger;

async function main() {
  try {
    logger.info('🏗️  Starting Prisma migration process...');

    // Connect to database
    logger.info('📡 Connecting to database...');
    await initializePrisma();

    // Check if already migrated
    const alreadyMigrated = await isMigrationRun();
    if (alreadyMigrated) {
      logger.warn('⚠️  Database appears to be already migrated. Skipping migrations.');
      await disconnectPrisma();
      process.exit(0);
    }

    // Run all migrations
    logger.info('🚀 Running migrations...');
    await runMigrations();

    logger.info('✅ Migration process completed successfully!');
    await disconnectPrisma();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    await disconnectPrisma();
    process.exit(1);
  }
}

main();
