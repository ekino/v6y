import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { AppLogger, DataBaseManager } from '@v6y/core-logic';

import ApplicationManager from '../managers/ApplicationManager.ts';
import {
    APPLICATION_ANALYSIS_QUEUE,
    APPLICATION_ANALYSIS_SINGLE_JOB,
} from './ApplicationAnalysisQueue.ts';

@Processor(APPLICATION_ANALYSIS_QUEUE, { lockDuration: 10 * 60 * 1000 })
export class ApplicationAnalysisProcessor extends WorkerHost {
    async process(job: Job<{ applicationId?: number }, unknown, string>) {
        AppLogger.info(`[ApplicationAnalysisProcessor] Processing job ${job.id} (${job.name})`);

        if (job.name !== APPLICATION_ANALYSIS_SINGLE_JOB) {
            throw new Error(`Unsupported application analysis job: ${job.name}`);
        }

        await DataBaseManager.connect();

        const applicationId = job.data?.applicationId;

        if (!applicationId) {
            throw new Error('The applicationId is required to process an application analysis');
        }

        return ApplicationManager.buildApplicationReportsById(applicationId);
    }
}
