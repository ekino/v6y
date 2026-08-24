import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DAILY_DIGEST_JOB, DAILY_DIGEST_SCHEDULE } from '../NotificationQueue.ts';
import { NotificationQueueService } from '../NotificationQueueService.ts';

describe('NotificationQueueService', () => {
    beforeEach(() => {
        delete process.env.V6Y_DAILY_DIGEST_CRON;
        delete process.env.V6Y_AUDIT_SCHEDULE_TIMEZONE;
    });

    describe('when the queue is available', () => {
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
        });

        it('falls back to a default cron and UTC when nothing is configured', async () => {
            const upsertJobScheduler = vi.fn().mockResolvedValue({});
            const service = new NotificationQueueService({ upsertJobScheduler } as never);

            await service.scheduleDailyDigest();

            expect(upsertJobScheduler).toHaveBeenCalledWith(
                DAILY_DIGEST_SCHEDULE,
                { pattern: '0 0 8 * * *', tz: 'UTC' },
                expect.anything(),
            );
        });

        it('removes the daily digest scheduler', async () => {
            const removeJobScheduler = vi.fn().mockResolvedValue(true);
            const service = new NotificationQueueService({ removeJobScheduler } as never);

            await expect(service.removeDailyDigestSchedule()).resolves.toBe(true);
            expect(removeJobScheduler).toHaveBeenCalledWith(DAILY_DIGEST_SCHEDULE);
        });
    });

    describe('when the queue is unavailable', () => {
        it('skips the scheduling instead of throwing', async () => {
            const service = new NotificationQueueService();

            await expect(service.scheduleDailyDigest()).resolves.toBeNull();
            await expect(service.removeDailyDigestSchedule()).resolves.toBe(false);
        });
    });
});
