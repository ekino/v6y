import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { AppLogger, DataBaseManager, DependencyProvider } from '@v6y/core-logic';

import ApplicationManager from '../managers/ApplicationManager.ts';
import {
    APPLICATION_ANALYSIS_QUEUE,
    APPLICATION_ANALYSIS_SINGLE_JOB,
    APPLICATION_ANALYSIS_STARTUP_JOB,
} from './ApplicationAnalysisQueue.ts';

@Processor(APPLICATION_ANALYSIS_QUEUE)
export class ApplicationAnalysisProcessor extends WorkerHost {
    async process(job: Job<{ applicationId?: number }, unknown, string>) {
        AppLogger.info(`[ApplicationAnalysisProcessor] Processing job ${job.id} (${job.name})`);

        await DataBaseManager.connect();

        switch (job.name) {
            case APPLICATION_ANALYSIS_STARTUP_JOB: {
                // Note: audits are intentionally kept for historical tracking (createdAt
                // timestamps). Only dependencies are cleared before a fresh analysis.
                await DependencyProvider.deleteDependencyList();
                return ApplicationManager.buildApplicationList();
            }

            case APPLICATION_ANALYSIS_SINGLE_JOB: {
                const applicationId = job.data?.applicationId;
                if (!applicationId) {
                    throw new Error(
                        'The applicationId is required to process an application analysis',
                    );
                }

                return ApplicationManager.buildApplicationReportsById(applicationId);
            }

            default:
                throw new Error(`Unsupported application analysis job: ${job.name}`);
        }
    }
}
