import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnApplicationBootstrap, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import { DATA_UPDATE_QUEUE, SLACK_DIGEST_CRON, SLACK_DIGEST_JOB } from './DataUpdateQueue.ts';

/**
 * Registers (or updates) the recurring Slack daily-digest scheduler once the
 * application has fully started. BullMQ persists the scheduler in Redis, so
 * it survives process restarts and does not stack duplicate entries.
 */
@Injectable()
export class SlackDigestScheduler implements OnApplicationBootstrap {
    constructor(
        @Optional()
        @InjectQueue(DATA_UPDATE_QUEUE)
        private readonly dataUpdateQueue?: Queue,
    ) {}

    async onApplicationBootstrap() {
        if (!this.dataUpdateQueue) {
            AppLogger.info(
                '[SlackDigestScheduler] Queue unavailable — Slack digest will not be scheduled.',
            );
            return;
        }

        // Skip scheduling if no bot token is configured (service is disabled).
        if (!process.env.V6Y_SLACK_BOT_TOKEN) {
            AppLogger.info(
                '[SlackDigestScheduler] V6Y_SLACK_BOT_TOKEN not set — digest scheduling skipped.',
            );
            return;
        }

        await this.dataUpdateQueue.upsertJobScheduler(
            SLACK_DIGEST_JOB,
            { pattern: SLACK_DIGEST_CRON, tz: 'UTC' },
            { name: SLACK_DIGEST_JOB, data: {} },
        );

        AppLogger.info(
            `[SlackDigestScheduler] Daily Slack digest scheduled (${SLACK_DIGEST_CRON} UTC).`,
        );
    }
}
