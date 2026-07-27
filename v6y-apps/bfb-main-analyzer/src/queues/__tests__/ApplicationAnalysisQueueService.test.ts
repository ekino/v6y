import { describe, expect, it, vi } from 'vitest';

import {
    APPLICATION_ANALYSIS_SINGLE_JOB,
    APPLICATION_ANALYSIS_STARTUP_JOB,
} from '../ApplicationAnalysisQueue.ts';
import { ApplicationAnalysisQueueService } from '../ApplicationAnalysisQueueService.ts';

describe('ApplicationAnalysisQueueService', () => {
    describe('when the queue is available', () => {
        it('enqueues a startup analysis job', async () => {
            const add = vi.fn().mockResolvedValue({ id: 'job-1' });
            const getJob = vi.fn().mockResolvedValue(undefined);
            const service = new ApplicationAnalysisQueueService({ add, getJob } as never);

            const job = await service.enqueueStartupAnalysis();

            expect(add).toHaveBeenCalledWith(
                APPLICATION_ANALYSIS_STARTUP_JOB,
                {},
                expect.objectContaining({
                    jobId: APPLICATION_ANALYSIS_STARTUP_JOB,
                    removeOnComplete: true,
                }),
            );
            expect(job).toEqual({ id: 'job-1' });
        });

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
    });

    describe('when the queue is unavailable', () => {
        it('skips enqueuing the startup analysis and returns null', async () => {
            const service = new ApplicationAnalysisQueueService(undefined);

            const job = await service.enqueueStartupAnalysis();

            expect(job).toBeNull();
        });

        it('skips enqueuing the application analysis and returns null', async () => {
            const service = new ApplicationAnalysisQueueService(undefined);

            const job = await service.enqueueApplicationAnalysis(42);

            expect(job).toBeNull();
        });
    });
});
