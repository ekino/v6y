import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import MailConfig from '../config/MailConfig.ts';
import {
    DAILY_DIGEST_JOB,
    DAILY_DIGEST_SCHEDULE,
    NOTIFICATION_QUEUE,
} from './NotificationQueue.ts';

@Injectable()
export class NotificationQueueService {
    constructor(
        @Optional()
        @InjectQueue(NOTIFICATION_QUEUE)
        private readonly notificationQueue?: Queue,
    ) {}

    /**
     * Install (or re-install) the recurring daily digest. Upserting is idempotent,
     * so this can run on every boot: it also repairs a scheduler lost with the
     * Redis data and picks up a changed cron without leaving the old one behind.
     */
    async scheduleDailyDigest() {
        if (!this.notificationQueue) {
            AppLogger.warn(
                '[NotificationQueueService] Queue unavailable, daily digest schedule skipped.',
            );
            return null;
        }

        const pattern = MailConfig.getDailyDigestCron();
        const tz = MailConfig.getDailyDigestTimezone();

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
                    backoff: {
                        type: 'exponential',
                        delay: 60000,
                    },
                    removeOnComplete: true,
                    removeOnFail: 20,
                },
            },
        );
    }

    /**
     * Drop the recurring daily digest, so mail delivery being turned off does not
     * leave a scheduler waking the process up every morning for nothing.
     */
    async removeDailyDigestSchedule() {
        if (!this.notificationQueue) {
            return false;
        }

        AppLogger.info('[NotificationQueueService] Removing the daily digest schedule.');

        return this.notificationQueue.removeJobScheduler(DAILY_DIGEST_SCHEDULE);
    }
}
