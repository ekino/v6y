import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { AppLogger, DataBaseManager } from '@v6y/core-logic';

import AuditNotificationManager from '../managers/AuditNotificationManager.ts';
import { DAILY_DIGEST_JOB, NOTIFICATION_QUEUE } from './NotificationQueue.ts';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
    async process(job: Job<unknown, unknown, string>) {
        AppLogger.info(`[NotificationProcessor] Processing job ${job.id} (${job.name})`);

        if (job.name !== DAILY_DIGEST_JOB) {
            throw new Error(`Unsupported notification job: ${job.name}`);
        }

        await DataBaseManager.connect();

        return AuditNotificationManager.sendDailyDigests();
    }
}
