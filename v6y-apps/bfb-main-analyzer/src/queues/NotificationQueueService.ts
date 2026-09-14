import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';
import {
    AUDIT_RUN_COMPLETED_JOB,
    DAILY_DIGEST_JOB,
    DAILY_DIGEST_SCHEDULE,
    EmailConfig,
    NOTIFICATION_QUEUE,
} from '@v6y/notifications';

@Injectable()
export class NotificationQueueService {
    constructor(
        @Optional()
        @InjectQueue(NOTIFICATION_QUEUE)
        private readonly notificationQueue?: Queue,
    ) {}

    async enqueueAuditRunCompleted(auditRunId: number): Promise<void> {
        if (!this.notificationQueue) {
            AppLogger.warn(
                '[NotificationQueueService] Queue unavailable, audit notification skipped.',
            );
            return;
        }

        await this.notificationQueue.add(
            AUDIT_RUN_COMPLETED_JOB,
            { auditRunId },
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5_000 },
                removeOnComplete: true,
                removeOnFail: 20,
            },
        );

        AppLogger.info(
            `[NotificationQueueService] Enqueued audit-run-completed for auditRunId=${auditRunId}.`,
        );
    }

    /** Re-installs the daily digest scheduler on every boot so Redis flushes and cron changes are recovered. */
    async scheduleDailyDigest() {
        if (!this.notificationQueue) {
            AppLogger.warn(
                '[NotificationQueueService] Queue unavailable, daily digest schedule skipped.',
            );
            return null;
        }

        const pattern = EmailConfig.getDailyDigestCron();
        const tz = EmailConfig.getDailyDigestTimezone();

        AppLogger.info(
            `[NotificationQueueService] Scheduling the daily digest with cron=${pattern}, tz=${tz}`,
        );

        return this.notificationQueue.upsertJobScheduler(
            DAILY_DIGEST_SCHEDULE,
            { pattern, tz },
            {
                name: DAILY_DIGEST_JOB,
                data: {},
                opts: {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 60_000 },
                    removeOnComplete: true,
                    removeOnFail: 20,
                },
            },
        );
    }

    async removeDailyDigestSchedule() {
        if (!this.notificationQueue) {
            return false;
        }

        AppLogger.info('[NotificationQueueService] Removing the daily digest schedule.');
        return this.notificationQueue.removeJobScheduler(DAILY_DIGEST_SCHEDULE);
    }
}
