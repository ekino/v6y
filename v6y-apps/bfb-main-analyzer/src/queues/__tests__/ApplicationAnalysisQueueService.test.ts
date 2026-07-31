import { describe, expect, it, vi } from 'vitest';

import {
    APPLICATION_ANALYSIS_SCHEDULE,
    APPLICATION_ANALYSIS_SINGLE_JOB,
} from '../ApplicationAnalysisQueue.ts';
import {
    AUDIT_SCHEDULE_TIMEZONE,
    ApplicationAnalysisQueueService,
} from '../ApplicationAnalysisQueueService.ts';

describe('ApplicationAnalysisQueueService', () => {
    describe('when the queue is available', () => {
        it('enqueues a single application analysis job with a deterministic jobId', async () => {
            const add = vi.fn().mockResolvedValue({ id: 'job-2' });
            const getJob = vi.fn().mockResolvedValue(undefined);
            const service = new ApplicationAnalysisQueueService({ add, getJob } as never);

            const job = await service.enqueueApplicationAnalysis(42);

            expect(getJob).toHaveBeenCalledWith(`${APPLICATION_ANALYSIS_SINGLE_JOB}-42`);
            expect(add).toHaveBeenCalledWith(
                APPLICATION_ANALYSIS_SINGLE_JOB,
                { applicationId: 42 },
                expect.objectContaining({
                    jobId: `${APPLICATION_ANALYSIS_SINGLE_JOB}-42`,
                    removeOnComplete: true,
                }),
            );
            expect(job).toEqual({ id: 'job-2' });
        });

        it('removes a previously failed job with the same jobId before re-enqueuing', async () => {
            const add = vi.fn().mockResolvedValue({ id: 'job-3' });
            const remove = vi.fn().mockResolvedValue(undefined);
            const getJob = vi.fn().mockResolvedValue({
                getState: vi.fn().mockResolvedValue('failed'),
                remove,
            });
            const service = new ApplicationAnalysisQueueService({ add, getJob } as never);

            const job = await service.enqueueApplicationAnalysis(42);

            expect(remove).toHaveBeenCalled();
            expect(add).toHaveBeenCalledWith(
                APPLICATION_ANALYSIS_SINGLE_JOB,
                { applicationId: 42 },
                expect.objectContaining({ jobId: `${APPLICATION_ANALYSIS_SINGLE_JOB}-42` }),
            );
            expect(job).toEqual({ id: 'job-3' });
        });

        it('leaves a job that is still running in place instead of removing it', async () => {
            const add = vi.fn().mockResolvedValue({ id: 'job-4' });
            const remove = vi.fn().mockResolvedValue(undefined);
            const getJob = vi.fn().mockResolvedValue({
                getState: vi.fn().mockResolvedValue('active'),
                remove,
            });
            const service = new ApplicationAnalysisQueueService({ add, getJob } as never);

            await service.enqueueApplicationAnalysis(42);

            expect(remove).not.toHaveBeenCalled();
        });
    });

    describe('when the queue is unavailable', () => {
        it('skips enqueuing the application analysis and returns null', async () => {
            const service = new ApplicationAnalysisQueueService(undefined);

            const job = await service.enqueueApplicationAnalysis(42);

            expect(job).toBeNull();
        });
    });

    describe('upsertApplicationSchedule', () => {
        it('upserts a job scheduler with a deterministic id, the application cron and an explicit timezone', async () => {
            const upsertJobScheduler = vi.fn().mockResolvedValue({ id: 'sched-job-1' });
            const service = new ApplicationAnalysisQueueService({
                upsertJobScheduler,
            } as never);

            const scheduledJob = await service.upsertApplicationSchedule(42, '0 */6 * * *');

            expect(upsertJobScheduler).toHaveBeenCalledWith(
                `${APPLICATION_ANALYSIS_SCHEDULE}-42`,
                // Without an explicit tz the pattern follows the container's
                // timezone, so the same schedule fires at a different wall-clock
                // time per host and shifts across DST.
                { pattern: '0 */6 * * *', tz: AUDIT_SCHEDULE_TIMEZONE },
                expect.objectContaining({
                    name: APPLICATION_ANALYSIS_SINGLE_JOB,
                    data: { applicationId: 42 },
                }),
            );
            expect(scheduledJob).toEqual({ id: 'sched-job-1' });
        });

        it('returns null and skips upserting when the queue is unavailable', async () => {
            const service = new ApplicationAnalysisQueueService(undefined);

            const scheduledJob = await service.upsertApplicationSchedule(42, '0 0 * * *');

            expect(scheduledJob).toBeNull();
        });
    });

    describe('removeApplicationSchedule', () => {
        it('removes the job scheduler for the given application', async () => {
            const removeJobScheduler = vi.fn().mockResolvedValue(true);
            const service = new ApplicationAnalysisQueueService({
                removeJobScheduler,
            } as never);

            const removed = await service.removeApplicationSchedule(42);

            expect(removeJobScheduler).toHaveBeenCalledWith(`${APPLICATION_ANALYSIS_SCHEDULE}-42`);
            expect(removed).toBe(true);
        });

        it('returns false and skips removal when the queue is unavailable', async () => {
            const service = new ApplicationAnalysisQueueService(undefined);

            const removed = await service.removeApplicationSchedule(42);

            expect(removed).toBe(false);
        });
    });

    describe('listApplicationScheduleIds', () => {
        it('lists only the application analysis scheduler ids', async () => {
            const getJobSchedulers = vi
                .fn()
                .mockResolvedValue([
                    { key: `${APPLICATION_ANALYSIS_SCHEDULE}-42` },
                    { key: `${APPLICATION_ANALYSIS_SCHEDULE}-7` },
                    { key: 'some-other-scheduler-1' },
                ]);
            const service = new ApplicationAnalysisQueueService({ getJobSchedulers } as never);

            const schedulerIds = await service.listApplicationScheduleIds();

            expect(schedulerIds).toEqual([
                `${APPLICATION_ANALYSIS_SCHEDULE}-42`,
                `${APPLICATION_ANALYSIS_SCHEDULE}-7`,
            ]);
        });

        it('falls back to the id field and skips entries without an identifier', async () => {
            const getJobSchedulers = vi
                .fn()
                .mockResolvedValue([
                    { id: `${APPLICATION_ANALYSIS_SCHEDULE}-42` },
                    { key: null, id: null },
                ]);
            const service = new ApplicationAnalysisQueueService({ getJobSchedulers } as never);

            expect(await service.listApplicationScheduleIds()).toEqual([
                `${APPLICATION_ANALYSIS_SCHEDULE}-42`,
            ]);
        });

        it('returns an empty list when the queue is unavailable', async () => {
            const service = new ApplicationAnalysisQueueService(undefined);

            expect(await service.listApplicationScheduleIds()).toEqual([]);
        });
    });
});
