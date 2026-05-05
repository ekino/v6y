import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

let _prisma: PrismaClient | null = null;

const buildDatabaseUrl = (): string => {
    const host = process.env.PSQL_DB_HOST || 'localhost';
    const name = process.env.PSQL_DB_NAME || 'v6y';
    const user = process.env.PSQL_DB_USER || 'v6y';
    const password = process.env.PSQL_DB_PASSWORD || 'v6y';
    const port = process.env.PSQL_DB_PORT || '5432';
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
};

const getPrismaClient = (): PrismaClient => {
    if (!_prisma) {
        const adapter = new PrismaPg(buildDatabaseUrl());
        _prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
    }
    return _prisma;
};

const disconnectPrismaClient = async (): Promise<void> => {
    if (_prisma) {
        await _prisma.$disconnect();
        _prisma = null;
    }
};

export { getPrismaClient, disconnectPrismaClient };
