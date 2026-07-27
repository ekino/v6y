import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import {
    APPLICATION_ANALYSIS_QUEUE,
    APPLICATION_ANALYSIS_SINGLE_JOB,
    APPLICATION_ANALYSIS_STARTUP_JOB,
} from './ApplicationAnalysisQueue.ts';

@Injectable()
export class ApplicationAnalysisQueueService {
    constructor(
        @Optional()
        @InjectQueue(APPLICATION_ANALYSIS_QUEUE)
        private readonly applicationAnalysisQueue?: Queue,
    ) {}

    async enqueueStartupAnalysis() {
        if (!this.applicationAnalysisQueue) {
            AppLogger.warn(
                '[ApplicationAnalysisQueueService] Queue unavailable, startup analysis enqueue skipped.',
            );
            return null;
        }

        AppLogger.info('[ApplicationAnalysisQueueService] Enqueuing startup application analysis');

        return this.applicationAnalysisQueue.add(
            APPLICATION_ANALYSIS_STARTUP_JOB,
            {},
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                jobId: APPLICATION_ANALYSIS_STARTUP_JOB,
                removeOnComplete: true,
                removeOnFail: 20,
            },
        );
    }

    async enqueueApplicationAnalysis(applicationId: number) {
        if (!this.applicationAnalysisQueue) {
            AppLogger.warn(
                '[ApplicationAnalysisQueueService] Queue unavailable, application analysis enqueue skipped.',
            );
            return null;
        }

        const jobId = `${APPLICATION_ANALYSIS_SINGLE_JOB}-${applicationId}`;

        // BullMQ refuses to create a new job while one with the same jobId still
        // exists (including in the failed set, since removeOnFail keeps it around).
        // Clear out a settled (failed/completed) job first so re-triggering after a
        // failure actually enqueues a new attempt instead of silently no-op'ing.
        const existingJob = await this.applicationAnalysisQueue.getJob(jobId);
        if (existingJob) {
            const existingJobState = await existingJob.getState();
            if (existingJobState === 'failed' || existingJobState === 'completed') {
                await existingJob.remove();
            }
        }

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
}
