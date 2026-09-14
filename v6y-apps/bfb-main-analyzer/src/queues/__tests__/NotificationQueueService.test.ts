import { describe, expect, it, vi } from 'vitest';

import {
    AUDIT_RUN_COMPLETED_JOB,
    DAILY_DIGEST_JOB,
    DAILY_DIGEST_SCHEDULE,
} from '@v6y/notifications';

import { NotificationQueueService } from '../NotificationQueueService.ts';

describe('NotificationQueueService', () => {
    describe('enqueueAuditRunCompleted', () => {
        it('adds an audit-run-completed job to the queue', async () => {
            const add = vi.fn().mockResolvedValue({ id: 'job-1' });
            const service = new NotificationQueueService({ add } as never);

            await service.enqueueAuditRunCompleted(42);

            expect(add).toHaveBeenCalledWith(
                AUDIT_RUN_COMPLETED_JOB,
                { auditRunId: 42 },
                expect.objectContaining({ attempts: 3 }),
            );
        });

        it('silently returns when the queue is unavailable', async () => {
            const service = new NotificationQueueService();
            await expect(service.enqueueAuditRunCompleted(42)).resolves.not.toThrow();
        });
    });

    describe('scheduleDailyDigest', () => {
        it('upserts the daily digest scheduler with the configured cron and timezone', async () => {
            process.env.V6Y_DAILY_DIGEST_CRON = '0 30 6 * * *';
            process.env.V6Y_AUDIT_SCHEDULE_TIMEZONE = 'Europe/Paris';

            const upsertJobScheduler = vi.fn().mockResolvedValue({ id: DAILY_DIGEST_SCHEDULE });
            const service = new NotificationQueueService({ upsertJobScheduler } as never);

            const scheduler = await service.scheduleDailyDigest();

            expect(upsertJobScheduler).toHaveBeenCalledWith(
                DAILY_DIGEST_SCHEDULE,
                { pattern: '0 30 6 * * *', tz: 'Europe/Paris' },
                expect.objectContaining({ name: DAILY_DIGEST_JOB }),
            );
            expect(scheduler).toEqual({ id: DAILY_DIGEST_SCHEDULE });

            delete process.env.V6Y_DAILY_DIGEST_CRON;
            delete process.env.V6Y_AUDIT_SCHEDULE_TIMEZONE;
        });

        it('returns null when the queue is unavailable', async () => {
            const service = new NotificationQueueService();
            await expect(service.scheduleDailyDigest()).resolves.toBeNull();
        });
    });

    describe('removeDailyDigestSchedule', () => {
        it('removes the daily digest scheduler', async () => {
            const removeJobScheduler = vi.fn().mockResolvedValue(true);
            const service = new NotificationQueueService({ removeJobScheduler } as never);

            await expect(service.removeDailyDigestSchedule()).resolves.toBe(true);
            expect(removeJobScheduler).toHaveBeenCalledWith(DAILY_DIGEST_SCHEDULE);
        });

        it('returns false when the queue is unavailable', async () => {
            const service = new NotificationQueueService();
            await expect(service.removeDailyDigestSchedule()).resolves.toBe(false);
        });
    });
});
