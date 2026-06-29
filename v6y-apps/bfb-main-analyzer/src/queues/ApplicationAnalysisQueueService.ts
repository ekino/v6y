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
                jobId: `${APPLICATION_ANALYSIS_SINGLE_JOB}-${applicationId}`,
                removeOnComplete: true,
                removeOnFail: 20,
            },
        );
    }
}
