import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import { AUDIT_RUN_COMPLETED_JOB, NOTIFICATION_QUEUE } from './NotificationQueue.ts';

/**
 * Producer-only wrapper for the notification queue.
 *
 * The `v6y-notifier` service consumes the jobs enqueued here.  This class
 * knows nothing about channels or templates — its only job is to push events.
 */
@Injectable()
export class NotificationQueueService {
    constructor(
        @Optional()
        @InjectQueue(NOTIFICATION_QUEUE)
        private readonly notificationQueue?: Queue,
    ) {}

    /**
     * Enqueue an audit-run-completed event.  Fire-and-forget: the notifier
     * processes it asynchronously, so a missing queue or a Redis hiccup must
     * never fail the audit BullMQ job.
     */
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
}
