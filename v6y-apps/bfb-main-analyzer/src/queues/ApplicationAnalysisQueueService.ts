import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import {
    APPLICATION_ANALYSIS_QUEUE,
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
}
