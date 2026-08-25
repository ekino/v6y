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
import {
    APPLICATION_LIST_UPDATE_JOB,
    DATA_UPDATE_QUEUE,
    EVOLUTION_UPDATE_JOB,
    KEYWORD_UPDATE_JOB,
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
// The full catalog sweep (APPLICATION_LIST_UPDATE_JOB) runs every application's
// audits sequentially inside a single BullMQ job and can take several minutes.
// BullMQ's default lockDuration (30s) is far shorter than that, so without this
// override the job gets flagged as stalled mid-run, moved back to "waiting", and
// re-picked-up from scratch — the root cause of the duplicate-run bug this
// processor otherwise guards against via recoverInterruptedAuditRuns/createAuditRun.
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
