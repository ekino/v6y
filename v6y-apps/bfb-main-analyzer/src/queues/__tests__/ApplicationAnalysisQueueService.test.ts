import { describe, expect, it, vi } from 'vitest';

import { APPLICATION_ANALYSIS_SINGLE_JOB } from '../ApplicationAnalysisQueue.ts';
import { ApplicationAnalysisQueueService } from '../ApplicationAnalysisQueueService.ts';

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
});
