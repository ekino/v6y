import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { AppLogger, DataBaseManager } from '@v6y/core-logic';
import {
    AUDIT_RUN_COMPLETED_JOB,
    DAILY_DIGEST_JOB,
    NOTIFICATION_QUEUE,
    NotificationDispatcher,
    NotificationEvent,
} from '@v6y/notifications';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
    constructor(private readonly dispatcher: NotificationDispatcher) {
        super();
    }

    async process(job: Job<{ auditRunId?: number }, unknown, string>) {
        AppLogger.info(`[NotificationProcessor] Processing job ${job.id} (${job.name})`);

        await DataBaseManager.connect();

        let event: NotificationEvent;

        if (job.name === AUDIT_RUN_COMPLETED_JOB) {
            const auditRunId = job.data?.auditRunId;

            if (!auditRunId) {
                throw new Error(
                    '[NotificationProcessor] audit-run-completed job is missing auditRunId',
                );
            }

            event = { type: 'audit-run-completed', data: { auditRunId } };
        } else if (job.name === DAILY_DIGEST_JOB) {
            event = { type: 'daily-digest', data: {} };
        } else {
            throw new Error(`[NotificationProcessor] Unsupported notification job: ${job.name}`);
        }

        return this.dispatcher.dispatch(event);
    }
}
