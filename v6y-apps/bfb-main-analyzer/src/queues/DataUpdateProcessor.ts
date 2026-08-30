import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import {
    AppLogger,
    AuditRunProvider,
    DataBaseManager,
    DependencyProvider,
    WorkerHelper,
} from '@v6y/core-logic';

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

@Processor(DATA_UPDATE_QUEUE, { lockDuration: 10 * 60 * 1000 })
export class DataUpdateProcessor extends WorkerHost {
    async process(job: Job<unknown, unknown, string>) {
        AppLogger.info(`[DataUpdateProcessor] Processing job ${job.id} (${job.name})`);

        await DataBaseManager.connect();

        if (job.name === APPLICATION_LIST_UPDATE_JOB) {
            await DependencyProvider.deleteDependencyList();
            await AuditRunProvider.recoverInterruptedAuditRuns();
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
