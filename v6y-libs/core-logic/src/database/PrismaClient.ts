import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import buildDatabaseUrl from './buildDatabaseUrl.ts';

let _prisma: PrismaClient | null = null;

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
