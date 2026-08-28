import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AuditRunProvider from '../database/AuditRunProvider.ts';
import { AUDIT_RUN_NON_TERMINAL_STATUSES, AUDIT_RUN_STATUS } from '../types/AuditRunType.ts';

const { auditRunMock } = vi.hoisted(() => ({
    auditRunMock: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
    },
}));

vi.mock('../core/AppLogger.ts', () => ({
    default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('../database/PrismaClient.ts', () => ({
    getPrismaClient: () => ({ auditRun: auditRunMock }),
    disconnectPrismaClient: vi.fn(),
}));

const FIXED_NOW = new Date('2026-08-28T12:00:00.000Z');
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

describe('AuditRunProvider', () => {
    beforeEach(() => {
        auditRunMock.findFirst.mockReset();
        auditRunMock.create.mockReset();
        auditRunMock.update.mockReset();
        auditRunMock.updateMany.mockReset();
        // updateMany destructures `{ count }`, so it must always resolve to an object.
        auditRunMock.updateMany.mockResolvedValue({ count: 0 });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('createAuditRun', () => {
        it('returns null and never touches the DB when appId is missing', async () => {
            const result = await AuditRunProvider.createAuditRun({} as never);

            expect(result).toBeNull();
            expect(auditRunMock.findFirst).not.toHaveBeenCalled();
            expect(auditRunMock.create).not.toHaveBeenCalled();
        });

        it('reuses an existing in_progress run instead of creating a duplicate', async () => {
            // The core of the fix: a run already advanced to in_progress must still
            // be seen by the dedup guard (not only `pending`).
            const existing = { id: 71, appId: 2, branch: null, runStatus: 'in_progress' };
            auditRunMock.findFirst.mockResolvedValue(existing);

            const result = await AuditRunProvider.createAuditRun({
                appId: 2,
                runStatus: AUDIT_RUN_STATUS.PENDING,
            });

            expect(auditRunMock.create).not.toHaveBeenCalled();
            expect(result).toMatchObject({ id: 71, _id: 71 });

            const dedupWhere = auditRunMock.findFirst.mock.calls[0][0].where;
            expect(dedupWhere.appId).toBe(2);
            expect(dedupWhere.branch).toBeNull();
            expect(dedupWhere.runStatus).toEqual({ in: AUDIT_RUN_NON_TERMINAL_STATUSES });
        });

        it('creates a new run when no active run exists', async () => {
            auditRunMock.findFirst.mockResolvedValue(null);
            auditRunMock.create.mockResolvedValue({
                id: 72,
                appId: 2,
                branch: null,
                runStatus: 'pending',
            });

            const result = await AuditRunProvider.createAuditRun({
                appId: 2,
                branch: undefined,
                runStatus: AUDIT_RUN_STATUS.PENDING,
                analysisTypes: ['static'],
            });

            expect(auditRunMock.create).toHaveBeenCalledTimes(1);
            const createData = auditRunMock.create.mock.calls[0][0].data;
            expect(createData.branch).toBeNull();
            expect(createData.runStatus).toBe(AUDIT_RUN_STATUS.PENDING);
            expect(result).toMatchObject({ id: 72, _id: 72 });
        });

        it('does not duplicate on a unique-constraint race (P2002) and re-fetches the winning run', async () => {
            const concurrent = { id: 71, appId: 2, branch: null, runStatus: 'in_progress' };
            auditRunMock.findFirst
                .mockResolvedValueOnce(null) // dedup check finds nothing
                .mockResolvedValueOnce(concurrent); // fallback fetch after the race
            auditRunMock.create.mockRejectedValueOnce({ code: 'P2002' });

            const result = await AuditRunProvider.createAuditRun({ appId: 2 });

            expect(auditRunMock.create).toHaveBeenCalledTimes(1);
            expect(auditRunMock.findFirst).toHaveBeenCalledTimes(2);
            expect(result).toMatchObject({ id: 71, _id: 71 });
        });

        it('returns null when create fails with a non-P2002 error', async () => {
            auditRunMock.findFirst.mockResolvedValue(null);
            auditRunMock.create.mockRejectedValueOnce(new Error('db down'));

            const result = await AuditRunProvider.createAuditRun({ appId: 2 });

            expect(result).toBeNull();
        });
    });

    describe('recoverInterruptedAuditRuns', () => {
        it('marks only stale, non-terminal runs as failed', async () => {
            vi.useFakeTimers();
            vi.setSystemTime(FIXED_NOW);
            auditRunMock.updateMany.mockResolvedValue({ count: 3 });

            await AuditRunProvider.recoverInterruptedAuditRuns();

            const arg = auditRunMock.updateMany.mock.calls[0][0];
            // Reaps pending AND in_progress — never a terminal status.
            expect(arg.where.runStatus).toEqual({ in: AUDIT_RUN_NON_TERMINAL_STATUSES });
            expect(arg.where.runStatus.in).not.toContain(AUDIT_RUN_STATUS.COMPLETED);
            expect(arg.where.runStatus.in).not.toContain(AUDIT_RUN_STATUS.FAILED);
            expect(arg.where.runStatus.in).not.toContain(AUDIT_RUN_STATUS.ERROR);
            // Only runs untouched for longer than the staleness threshold.
            expect(arg.where.updatedAt.lt).toEqual(
                new Date(FIXED_NOW.getTime() - THIRTY_MINUTES_MS),
            );
            expect(arg.data.runStatus).toBe(AUDIT_RUN_STATUS.FAILED);
            expect(arg.data.completedAt).toBeInstanceOf(Date);
            expect(arg.data.errorMessage).toMatch(/interrupted/i);
        });

        it('honours a custom stale threshold', async () => {
            vi.useFakeTimers();
            vi.setSystemTime(FIXED_NOW);
            const customThreshold = 60 * 1000;

            await AuditRunProvider.recoverInterruptedAuditRuns(customThreshold);

            const arg = auditRunMock.updateMany.mock.calls[0][0];
            expect(arg.where.updatedAt.lt).toEqual(new Date(FIXED_NOW.getTime() - customThreshold));
        });

        it('never throws when the update fails', async () => {
            auditRunMock.updateMany.mockRejectedValue(new Error('db down'));

            await expect(AuditRunProvider.recoverInterruptedAuditRuns()).resolves.toBeUndefined();
        });
    });

    describe('completeAuditRun', () => {
        it('marks the run failed when there are errors', async () => {
            auditRunMock.update.mockResolvedValue({ id: 5, runStatus: 'failed' });

            await AuditRunProvider.completeAuditRun(5, true);

            const call = auditRunMock.update.mock.calls[0][0];
            expect(call.where).toEqual({ id: 5 });
            expect(call.data.runStatus).toBe(AUDIT_RUN_STATUS.FAILED);
            expect(call.data.completedAt).toBeInstanceOf(Date);
            expect(call.data.errorMessage).toBe('Audit completed with errors');
        });

        it('marks the run completed when there are no errors', async () => {
            auditRunMock.update.mockResolvedValue({ id: 5, runStatus: 'completed' });

            await AuditRunProvider.completeAuditRun(5);

            const call = auditRunMock.update.mock.calls[0][0];
            expect(call.data.runStatus).toBe(AUDIT_RUN_STATUS.COMPLETED);
            expect(call.data.errorMessage).toBeNull();
        });
    });

    describe('updateAuditRunStatus', () => {
        it('updates the status and returns the row with an _id alias', async () => {
            auditRunMock.update.mockResolvedValue({ id: 9, runStatus: 'in_progress' });

            const result = await AuditRunProvider.updateAuditRunStatus({
                auditRunId: 9,
                runStatus: AUDIT_RUN_STATUS.IN_PROGRESS,
            });

            const call = auditRunMock.update.mock.calls[0][0];
            expect(call.where).toEqual({ id: 9 });
            expect(call.data.runStatus).toBe(AUDIT_RUN_STATUS.IN_PROGRESS);
            expect(call.data.completedAt).toBeNull();
            expect(call.data.errorMessage).toBeNull();
            expect(result).toMatchObject({ id: 9, _id: 9 });
        });
    });
});
