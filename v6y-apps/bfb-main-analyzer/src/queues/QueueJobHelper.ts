import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

/**
 * Clear a job that already settled before re-enqueuing the same jobId.
 *
 * A deterministic jobId is what keeps a boot and the midnight cron from stacking
 * duplicate work, but BullMQ refuses to create a job while one with that id still
 * exists — including in the failed set, which `removeOnFail` deliberately keeps
 * around. Without this cleanup, re-enqueuing after a failure silently resolves to
 * the old failed job: the nightly refresh would never run again, and "Run Audit"
 * would stop working for an application whose previous audit failed.
 */
export const removeSettledJob = async (queue: Queue, jobId: string) => {
    const existingJob = await queue.getJob(jobId);

    if (!existingJob) {
        return;
    }

    const existingJobState = await existingJob.getState();

    if (existingJobState === 'failed' || existingJobState === 'completed') {
        AppLogger.info(
            `[QueueJobHelper] Removing settled job ${jobId} (${existingJobState}) before re-enqueuing`,
        );
        await existingJob.remove();
    }
};
