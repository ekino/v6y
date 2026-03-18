/**
 * Raw SQL Migration Runner
 * Executes migration files in sequence to setup the new database schema
 * Place this in your database initialization routine
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import AppLogger from '../core/AppLogger.ts';
import { prisma } from './PrismaClient.ts';

const logger = AppLogger;

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const MIGRATIONS_DIR = path.resolve(currentDir, '../../prisma/migrations');

/**
 * Execute a single SQL statement, gracefully skipping if dependent tables don't exist
 */
async function executeStatement(statement: string): Promise<void> {
    try {
        await prisma.$executeRawUnsafe(statement);
    } catch (statementError) {
        const errorMsg = String(statementError);
        // Skip if missing dependent tables (e.g., Application table not yet restored)
        if (errorMsg.includes('relation') && errorMsg.includes('does not exist')) {
            logger.warn(
                `⚠️  Skipping statement due to missing table (restore database dump first): ${statement.substring(0, 50)}...`,
            );
        } else {
            throw statementError;
        }
    }
}

/**
 * Run all migration files in order
 * Migration files should be named: 001_name.sql, 002_name.sql, etc.
 */
export async function runMigrations(): Promise<void> {
    try {
        logger.info('Starting database migrations...');

        const migrationFiles = await fs.readdir(MIGRATIONS_DIR);
        migrationFiles.sort();

        const sqlFiles = migrationFiles.filter((f) => f.endsWith('.sql'));

        for (const file of sqlFiles) {
            const filePath = path.join(MIGRATIONS_DIR, file);
            const sql = await fs.readFile(filePath, 'utf-8');
            const cleanedSql = sql
                .split('\n')
                .filter((line) => !line.trim().startsWith('#'))
                .join('\n');

            logger.info(`Running migration: ${file}`);

            // Split by ; to handle multiple statements
            const statements = cleanedSql.split(';').filter((s) => s.trim());

            for (const statement of statements) {
                await executeStatement(statement);
            }

            logger.info(`✓ Migration completed: ${file}`);
        }

        logger.info('✓ All migrations completed successfully');
    } catch (error) {
        logger.error('✗ Migration process failed', error);
        throw error;
    }
}

/**
 * Check if a migration has already been run
 * Useful for idempotent migrations
 */
export async function isMigrationRun(): Promise<boolean> {
    try {
        // Check if the main tables exist
        const result = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
            `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'audit_execution'
      )`,
        );

        return result[0]?.exists || false;
    } catch {
        return false;
    }
}

export default { runMigrations, isMigrationRun };
