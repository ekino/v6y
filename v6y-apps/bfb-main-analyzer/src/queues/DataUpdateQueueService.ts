import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import {
    APPLICATION_LIST_UPDATE_JOB,
    DATA_UPDATE_QUEUE,
    EVOLUTION_UPDATE_JOB,
    KEYWORD_UPDATE_JOB,
} from './DataUpdateQueue.ts';
import { removeSettledJob } from './QueueJobHelper.ts';

@Injectable()
export class DataUpdateQueueService {
    constructor(
        @Optional()
        @InjectQueue(DATA_UPDATE_QUEUE)
        private readonly dataUpdateQueue?: Queue,
    ) {}

    /**
     * The job name doubles as the jobId: there is only ever one refresh of each kind
     * in flight, so a boot followed by the midnight cron replaces the pending job
     * instead of stacking a duplicate sweep.
     */
    private async enqueue(jobName: string) {
        if (!this.dataUpdateQueue) {
            AppLogger.warn(
                `[DataUpdateQueueService] Queue unavailable, ${jobName} enqueue skipped.`,
            );
            return null;
        }

        await removeSettledJob(this.dataUpdateQueue, jobName);

        AppLogger.info(`[DataUpdateQueueService] Enqueuing ${jobName}`);

        return this.dataUpdateQueue.add(
            jobName,
            {},
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                jobId: jobName,
                removeOnComplete: true,
                removeOnFail: 20,
            },
        );
    }

    async enqueueApplicationListUpdate() {
        return this.enqueue(APPLICATION_LIST_UPDATE_JOB);
    }

    async enqueueKeywordUpdate() {
        return this.enqueue(KEYWORD_UPDATE_JOB);
    }

    async enqueueEvolutionUpdate() {
        return this.enqueue(EVOLUTION_UPDATE_JOB);
    }
}
