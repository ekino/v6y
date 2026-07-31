import { beforeEach, describe, expect, it, vi } from 'vitest';

import { APPLICATION_ANALYSIS_SCHEDULE } from '../queues/ApplicationAnalysisQueue.ts';
import ApplicationScheduleReconciler from '../workers/ApplicationScheduleReconciler.ts';

const { getScheduledApplicationList } = vi.hoisted(() => ({
    getScheduledApplicationList: vi.fn(),
}));

vi.mock('@v6y/core-logic', () => ({
    AppLogger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
    ApplicationProvider: { getScheduledApplicationList },
}));

const buildQueueService = () => ({
    upsertApplicationSchedule: vi.fn().mockResolvedValue({ id: 'sched-1' }),
    removeApplicationSchedule: vi.fn().mockResolvedValue(true),
    listApplicationScheduleIds: vi.fn().mockResolvedValue([]),
});

describe('ApplicationScheduleReconciler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('re-applies the schedule of every application that has one', async () => {
        getScheduledApplicationList.mockResolvedValue([
            { _id: 42, auditFrequencyCron: '0 */6 * * *' },
            { _id: 7, auditFrequencyCron: '0 0 * * 1' },
        ]);
        const queueService = buildQueueService();

        await ApplicationScheduleReconciler.reconcile(queueService as never);

        expect(queueService.upsertApplicationSchedule).toHaveBeenCalledWith(42, '0 */6 * * *');
        expect(queueService.upsertApplicationSchedule).toHaveBeenCalledWith(7, '0 0 * * 1');
        expect(queueService.removeApplicationSchedule).not.toHaveBeenCalled();
    });

    it('removes a scheduler whose application no longer schedules audits', async () => {
        getScheduledApplicationList.mockResolvedValue([
            { _id: 42, auditFrequencyCron: '0 */6 * * *' },
        ]);
        const queueService = buildQueueService();
        queueService.listApplicationScheduleIds.mockResolvedValue([
            `${APPLICATION_ANALYSIS_SCHEDULE}-42`,
            `${APPLICATION_ANALYSIS_SCHEDULE}-99`,
        ]);

        await ApplicationScheduleReconciler.reconcile(queueService as never);

        expect(queueService.removeApplicationSchedule).toHaveBeenCalledTimes(1);
        expect(queueService.removeApplicationSchedule).toHaveBeenCalledWith(99);
    });

    it('does nothing at all when the scheduled applications cannot be read', async () => {
        // An unreachable database must not be read as "no application schedules
        // audits", which would delete every schedule in Redis.
        getScheduledApplicationList.mockResolvedValue(null);
        const queueService = buildQueueService();
        queueService.listApplicationScheduleIds.mockResolvedValue([
            `${APPLICATION_ANALYSIS_SCHEDULE}-42`,
        ]);

        await ApplicationScheduleReconciler.reconcile(queueService as never);

        expect(queueService.upsertApplicationSchedule).not.toHaveBeenCalled();
        expect(queueService.removeApplicationSchedule).not.toHaveBeenCalled();
    });

    it('skips an invalid or over-frequent cron instead of installing it', async () => {
        getScheduledApplicationList.mockResolvedValue([
            { _id: 1, auditFrequencyCron: 'not-a-cron' },
            { _id: 2, auditFrequencyCron: '* * * * * *' },
            { _id: 3, auditFrequencyCron: '0 0 * * *' },
        ]);
        const queueService = buildQueueService();

        await ApplicationScheduleReconciler.reconcile(queueService as never);

        expect(queueService.upsertApplicationSchedule).toHaveBeenCalledTimes(1);
        expect(queueService.upsertApplicationSchedule).toHaveBeenCalledWith(3, '0 0 * * *');
    });

    it('keeps reconciling the other applications when one upsert fails', async () => {
        getScheduledApplicationList.mockResolvedValue([
            { _id: 1, auditFrequencyCron: '0 0 * * *' },
            { _id: 2, auditFrequencyCron: '0 0 * * 1' },
        ]);
        const queueService = buildQueueService();
        queueService.upsertApplicationSchedule
            .mockRejectedValueOnce(new Error('redis unavailable'))
            .mockResolvedValueOnce({ id: 'sched-2' });

        await ApplicationScheduleReconciler.reconcile(queueService as never);

        expect(queueService.upsertApplicationSchedule).toHaveBeenCalledTimes(2);
    });
});
