import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import EmailConfig from '../channels/email/EmailConfig.ts';
import {
    DAILY_DIGEST_JOB,
    DAILY_DIGEST_SCHEDULE,
    NOTIFICATION_QUEUE,
} from './NotificationQueue.ts';

/**
 * Owns the daily-digest job scheduler.  The notifier service re-installs it on
 * every boot so that a Redis flush or a cron change is automatically repaired.
 */
@Injectable()
export class NotificationQueueService {
    constructor(
        @Optional()
        @InjectQueue(NOTIFICATION_QUEUE)
        private readonly notificationQueue?: Queue,
    ) {}

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
