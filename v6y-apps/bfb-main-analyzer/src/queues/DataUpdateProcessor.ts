import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { AppLogger, DataBaseManager, DependencyProvider, WorkerHelper } from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';
import ApplicationManager from '../managers/ApplicationManager.ts';
import SlackNotificationManager from '../slack/SlackNotificationManager.ts';
import {
    APPLICATION_LIST_UPDATE_JOB,
    DATA_UPDATE_QUEUE,
    EVOLUTION_UPDATE_JOB,
    KEYWORD_UPDATE_JOB,
    SLACK_DIGEST_JOB,
} from './DataUpdateQueue.ts';

const { forkWorker } = WorkerHelper;
const { currentConfig } = ServerConfig;

const FORKED_WORKERS: Record<string, string> = {
    [KEYWORD_UPDATE_JOB]: './src/workers/KeywordWorker.ts',
    [EVOLUTION_UPDATE_JOB]: './src/workers/EvolutionWorker.ts',
};

/**
 * The keyword and evolution refreshes keep running in worker threads: a BullMQ
 * processor runs in this service's process, so doing that work inline would block
 * the event loop serving the analyzer's HTTP API. The queue contributes scheduling,
 * retries with backoff and persistence across restarts.
 */
@Processor(DATA_UPDATE_QUEUE)
export class DataUpdateProcessor extends WorkerHost {
    async process(job: Job<unknown, unknown, string>) {
        AppLogger.info(`[DataUpdateProcessor] Processing job ${job.id} (${job.name})`);

        await DataBaseManager.connect();

        if (job.name === APPLICATION_LIST_UPDATE_JOB) {
            // Audits are intentionally kept for historical tracking (they carry their
            // own timestamps). Only dependencies are cleared before a fresh sweep.
            await DependencyProvider.deleteDependencyList();
            return ApplicationManager.buildApplicationList();
        }

        if (job.name === SLACK_DIGEST_JOB) {
            return SlackNotificationManager.sendDailyDigest();
        }

        const workerPath = FORKED_WORKERS[job.name];

        if (!workerPath) {
            throw new Error(`Unsupported data update job: ${job.name}`);
        }

        const result = await forkWorker(workerPath, currentConfig);

        // These workers catch their own errors and report them as a plain message, so
        // its wording is the only failure signal available. Without this check a failed
        // refresh would be recorded as a completed job and never retried.
        if (typeof result === 'string' && /error|failed/i.test(result)) {
            throw new Error(`[DataUpdateProcessor] ${job.name} reported a failure: ${result}`);
        }

        return result;
    }
}
