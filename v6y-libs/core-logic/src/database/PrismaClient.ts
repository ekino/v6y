import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import AppLogger from '../core/AppLogger.ts';

const logger = AppLogger;

// Declare global type for Prisma client (needed for hot reload in development)
declare const global: Record<string, unknown>;

/**
 * Gets or creates a singleton instance of PrismaClient
 * In development, reuses the same connection on hot reload
 * In production, creates a single instance at startup
 */
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function getDatabaseConnectionString(): string {
    const directDatabaseUrl = process.env.DATABASE_URL;
    if (directDatabaseUrl && !directDatabaseUrl.includes('${')) {
        return directDatabaseUrl;
    }

    const host = process.env.PSQL_DB_HOST;
    const dbName = process.env.PSQL_DB_NAME;
    const user = process.env.PSQL_DB_USER;
    const password = process.env.PSQL_DB_PASSWORD;
    const port = process.env.PSQL_DB_PORT;

    if (host && dbName && user && password && port) {
        return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${dbName}`;
    }

    throw new Error(
        'Database configuration is invalid. Set a concrete DATABASE_URL or define PSQL_DB_HOST, PSQL_DB_NAME, PSQL_DB_USER, PSQL_DB_PASSWORD, and PSQL_DB_PORT.',
    );
}

function createPrismaClient(): PrismaClient {
    const connectionString = getDatabaseConnectionString();

    const adapter = new PrismaPg({ connectionString });

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
}

export const prisma: PrismaClient = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

/**
 * Initialize and test the Prisma database connection
 * Should be called during application startup
 */
export async function initializePrisma(): Promise<void> {
    try {
        await prisma.$connect();
        logger.info('✓ Prisma connected to database successfully');
    } catch (error) {
        logger.error('✗ Failed to connect to database via Prisma:', error);
        throw error;
    }
}

/**
 * Gracefully disconnect from the database
 * Should be called during application shutdown
 */
export async function disconnectPrisma(): Promise<void> {
    await prisma.$disconnect();
    logger.info('✓ Prisma disconnected from database');
}

export default prisma;
