import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import {
    APPLICATION_ANALYSIS_QUEUE,
    APPLICATION_ANALYSIS_SCHEDULE,
    APPLICATION_ANALYSIS_SINGLE_JOB,
} from './ApplicationAnalysisQueue.ts';
import { removeSettledJob } from './QueueJobHelper.ts';

/**
 * Timezone the audit cron patterns are evaluated in. Pinned explicitly (rather
 * than inherited from the container, which is UTC in Docker) so a schedule fires
 * at the same wall-clock time whatever the host, and does not shift by an hour
 * across DST.
 */
export const AUDIT_SCHEDULE_TIMEZONE = process.env.V6Y_AUDIT_SCHEDULE_TIMEZONE || 'UTC';

@Injectable()
export class ApplicationAnalysisQueueService {
    constructor(
        @Optional()
        @InjectQueue(APPLICATION_ANALYSIS_QUEUE)
        private readonly applicationAnalysisQueue?: Queue,
    ) {}

    async enqueueApplicationAnalysis(applicationId: number) {
        if (!this.applicationAnalysisQueue) {
            AppLogger.warn(
                '[ApplicationAnalysisQueueService] Queue unavailable, application analysis enqueue skipped.',
            );
            return null;
        }

        const jobId = `${APPLICATION_ANALYSIS_SINGLE_JOB}-${applicationId}`;

        await removeSettledJob(this.applicationAnalysisQueue, jobId);

        AppLogger.info(
            `[ApplicationAnalysisQueueService] Enqueuing application analysis for applicationId=${applicationId}`,
        );

        return this.applicationAnalysisQueue.add(
            APPLICATION_ANALYSIS_SINGLE_JOB,
            { applicationId },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                jobId,
                removeOnComplete: true,
                removeOnFail: 20,
            },
        );
    }

    /**
     * Create or update the recurring "audit reporting frequency" job scheduler for
     * an application. Job schedulers live in Redis, so this survives a
     * main-analyzer process restart — but not the loss of the Redis data itself,
     * which is why `ApplicationScheduleReconciler` re-applies every enabled
     * schedule from the database on boot.
     */
    async upsertApplicationSchedule(applicationId: number, cronExpression: string) {
        if (!this.applicationAnalysisQueue) {
            AppLogger.warn(
                '[ApplicationAnalysisQueueService] Queue unavailable, application schedule upsert skipped.',
            );
            return null;
        }

        const jobSchedulerId = `${APPLICATION_ANALYSIS_SCHEDULE}-${applicationId}`;

        AppLogger.info(
            `[ApplicationAnalysisQueueService] Upserting application analysis schedule for applicationId=${applicationId}, cron=${cronExpression}, tz=${AUDIT_SCHEDULE_TIMEZONE}`,
        );

        return this.applicationAnalysisQueue.upsertJobScheduler(
            jobSchedulerId,
            { pattern: cronExpression, tz: AUDIT_SCHEDULE_TIMEZONE },
            {
                name: APPLICATION_ANALYSIS_SINGLE_JOB,
                data: { applicationId },
                opts: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 1000,
                    },
                    removeOnComplete: true,
                    removeOnFail: 20,
                },
            },
        );
    }

    /**
     * The ids of every application analysis job scheduler currently registered in
     * Redis, used to prune the ones whose application no longer schedules audits.
     */
    async listApplicationScheduleIds(): Promise<string[]> {
        if (!this.applicationAnalysisQueue) {
            AppLogger.warn(
                '[ApplicationAnalysisQueueService] Queue unavailable, application schedule listing skipped.',
            );
            return [];
        }

        // The identifier is exposed as `key` by BullMQ's job scheduler JSON, but
        // read `id` as a fallback so a rename in a future release degrades to
        // "nothing to prune" instead of throwing during reconciliation.
        const schedulers = (await this.applicationAnalysisQueue.getJobSchedulers(0, -1, true)) as
            | Array<{ id?: string | null; key?: string | null }>
            | undefined;

        return (schedulers || [])
            .map((scheduler) => scheduler?.key || scheduler?.id)
            .filter(
                (schedulerId): schedulerId is string =>
                    !!schedulerId && schedulerId.startsWith(`${APPLICATION_ANALYSIS_SCHEDULE}-`),
            );
    }

    /**
     * Remove the recurring "audit reporting frequency" job scheduler for an
     * application, if any. A no-op (resolves `false`) when none exists.
     */
    async removeApplicationSchedule(applicationId: number) {
        if (!this.applicationAnalysisQueue) {
            AppLogger.warn(
                '[ApplicationAnalysisQueueService] Queue unavailable, application schedule removal skipped.',
            );
            return false;
        }

        const jobSchedulerId = `${APPLICATION_ANALYSIS_SCHEDULE}-${applicationId}`;

        AppLogger.info(
            `[ApplicationAnalysisQueueService] Removing application analysis schedule for applicationId=${applicationId}`,
        );

        return this.applicationAnalysisQueue.removeJobScheduler(jobSchedulerId);
    }
}
