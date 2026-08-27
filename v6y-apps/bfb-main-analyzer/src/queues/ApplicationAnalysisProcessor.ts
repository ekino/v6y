import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { AppLogger, DataBaseManager } from '@v6y/core-logic';

import ApplicationManager from '../managers/ApplicationManager.ts';
import SlackNotificationManager from '../slack/SlackNotificationManager.ts';
import {
    APPLICATION_ANALYSIS_QUEUE,
    APPLICATION_ANALYSIS_SINGLE_JOB,
} from './ApplicationAnalysisQueue.ts';

@Processor(APPLICATION_ANALYSIS_QUEUE)
export class ApplicationAnalysisProcessor extends WorkerHost {
    async process(job: Job<{ applicationId?: number; auditRunId?: number }, unknown, string>) {
        AppLogger.info(`[ApplicationAnalysisProcessor] Processing job ${job.id} (${job.name})`);

        if (job.name !== APPLICATION_ANALYSIS_SINGLE_JOB) {
            throw new Error(`Unsupported application analysis job: ${job.name}`);
        }

        await DataBaseManager.connect();

        const applicationId = job.data?.applicationId;
        const auditRunId = job.data?.auditRunId;

        if (!applicationId) {
            throw new Error('The applicationId is required to process an application analysis');
        }

        const success = await ApplicationManager.buildApplicationReportsById(applicationId);

        // Fire-and-forget: Slack DM failures must never break the audit pipeline.
        SlackNotificationManager.notifyAuditComplete(
            applicationId,
            auditRunId,
            Boolean(success),
        ).catch((err) =>
            AppLogger.error('[ApplicationAnalysisProcessor] Slack notification error:', err),
        );

        return success;
    }
}
