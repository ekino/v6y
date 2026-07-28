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
     * an application. Since job schedulers are stored in Redis, this survives a
     * main-analyzer restart without needing to be re-registered on boot.
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
            `[ApplicationAnalysisQueueService] Upserting application analysis schedule for applicationId=${applicationId}, cron=${cronExpression}`,
        );

        return this.applicationAnalysisQueue.upsertJobScheduler(
            jobSchedulerId,
            { pattern: cronExpression },
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
