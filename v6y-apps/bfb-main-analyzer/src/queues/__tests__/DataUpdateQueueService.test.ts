import { describe, expect, it, vi } from 'vitest';

import {
    APPLICATION_LIST_UPDATE_JOB,
    EVOLUTION_UPDATE_JOB,
    KEYWORD_UPDATE_JOB,
} from '../DataUpdateQueue.ts';
import { DataUpdateQueueService } from '../DataUpdateQueueService.ts';

describe('DataUpdateQueueService', () => {
    describe('when the queue is available', () => {
        it.each([
            ['enqueueApplicationListUpdate', APPLICATION_LIST_UPDATE_JOB],
            ['enqueueKeywordUpdate', KEYWORD_UPDATE_JOB],
            ['enqueueEvolutionUpdate', EVOLUTION_UPDATE_JOB],
        ] as const)('%s enqueues %s with a deterministic jobId', async (method, jobName) => {
            const add = vi.fn().mockResolvedValue({ id: 'job-1' });
            const getJob = vi.fn().mockResolvedValue(undefined);
            const service = new DataUpdateQueueService({ add, getJob } as never);

            const job = await service[method]();

            expect(getJob).toHaveBeenCalledWith(jobName);
            expect(add).toHaveBeenCalledWith(
                jobName,
                {},
                expect.objectContaining({ jobId: jobName, removeOnComplete: true }),
            );
            expect(job).toEqual({ id: 'job-1' });
        });

        it('removes a previously failed refresh before re-enqueuing it', async () => {
            // Without this, a single failed nightly refresh would permanently stop the
            // cron: BullMQ would keep resolving to the retained failed job.
            const add = vi.fn().mockResolvedValue({ id: 'job-2' });
            const remove = vi.fn().mockResolvedValue(undefined);
            const getJob = vi.fn().mockResolvedValue({
                getState: vi.fn().mockResolvedValue('failed'),
                remove,
            });
            const service = new DataUpdateQueueService({ add, getJob } as never);

            await service.enqueueApplicationListUpdate();

            expect(remove).toHaveBeenCalled();
            expect(add).toHaveBeenCalledWith(
                APPLICATION_LIST_UPDATE_JOB,
                {},
                expect.objectContaining({ jobId: APPLICATION_LIST_UPDATE_JOB }),
            );
        });

        it('leaves a refresh that is still waiting in place', async () => {
            const add = vi.fn().mockResolvedValue({ id: 'job-3' });
            const remove = vi.fn().mockResolvedValue(undefined);
            const getJob = vi.fn().mockResolvedValue({
                getState: vi.fn().mockResolvedValue('waiting'),
                remove,
            });
            const service = new DataUpdateQueueService({ add, getJob } as never);

            await service.enqueueKeywordUpdate();

            expect(remove).not.toHaveBeenCalled();
        });
    });

    describe('when the queue is unavailable', () => {
        it('skips enqueuing and returns null', async () => {
            const service = new DataUpdateQueueService(undefined);

            await expect(service.enqueueApplicationListUpdate()).resolves.toBeNull();
            await expect(service.enqueueKeywordUpdate()).resolves.toBeNull();
            await expect(service.enqueueEvolutionUpdate()).resolves.toBeNull();
        });
    });
});
