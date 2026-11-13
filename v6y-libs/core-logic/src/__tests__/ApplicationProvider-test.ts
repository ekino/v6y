import { beforeEach, describe, expect, it, vi } from 'vitest';

import ApplicationProvider from '../database/ApplicationProvider.ts';
import { AccountType } from '../types/AccountType.ts';

const { applicationMock, getApplicationsIdsByKeywordsMock } = vi.hoisted(() => ({
    applicationMock: {
        findMany: vi.fn(),
        count: vi.fn(),
    },
    getApplicationsIdsByKeywordsMock: vi.fn(),
}));

vi.mock('../core/AppLogger.ts', () => ({
    default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('../database/PrismaClient.ts', () => ({
    getPrismaClient: () => ({ application: applicationMock }),
    disconnectPrismaClient: vi.fn(),
}));

vi.mock('../database/KeywordProvider.ts', () => ({
    default: { getApplicationsIdsByKeywords: getApplicationsIdsByKeywordsMock },
}));

const listWhere = async (search: object, user?: AccountType) => {
    await ApplicationProvider.getApplicationListByPageAndParams(search, user);
    return applicationMock.findMany.mock.calls[0][0].where;
};

const countWhere = async (search: object, user: AccountType) => {
    await ApplicationProvider.getApplicationTotalByParams(search, user);
    return applicationMock.count.mock.calls[0][0].where;
};

describe('ApplicationProvider - application visibility', () => {
    beforeEach(() => {
        applicationMock.findMany.mockReset().mockResolvedValue([]);
        applicationMock.count.mockReset().mockResolvedValue(0);
        getApplicationsIdsByKeywordsMock.mockReset();
    });

    it('lets an admin see every application', async () => {
        expect(await listWhere({}, { role: 'ADMIN' })).toEqual({});
        expect(await countWhere({}, { role: 'SUPERADMIN' })).toEqual({});
    });

    it('limits a member to the applications of the account', async () => {
        expect(await listWhere({}, { role: 'USER', applications: [1, 2] })).toEqual({
            AND: [{ id: { in: [1, 2] } }],
        });
    });

    it('shows nothing to a member without applications', async () => {
        expect(await listWhere({}, { role: 'USER', applications: [] })).toEqual({
            AND: [{ id: { in: [] } }],
        });
        expect(await countWhere({}, { role: 'USER' })).toEqual({
            AND: [{ id: { in: [] } }],
        });
    });

    it('shows nothing when no account is given', async () => {
        expect(await listWhere({})).toEqual({ AND: [{ id: { in: [] } }] });
    });

    it('combines the keyword filter with the member scope instead of overwriting it', async () => {
        getApplicationsIdsByKeywordsMock.mockResolvedValue([2, 3]);

        expect(
            await listWhere({ keywords: ['react'] }, { role: 'USER', applications: [1, 2] }),
        ).toEqual({
            AND: [{ id: { in: [2, 3] } }, { id: { in: [1, 2] } }],
        });
    });

    it('matches nothing when no application carries the requested keywords', async () => {
        getApplicationsIdsByKeywordsMock.mockResolvedValue(null);

        expect(await listWhere({ keywords: ['unknown'] }, { role: 'ADMIN' })).toEqual({
            AND: [{ id: { in: [] } }],
        });
    });

    it('keeps the text search alongside the scope', async () => {
        const where = await listWhere({ searchText: 'v6y' }, { role: 'USER', applications: [1] });

        expect(where.OR).toHaveLength(4);
        expect(where.AND).toEqual([{ id: { in: [1] } }]);
    });
});
