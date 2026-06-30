import CronJob from 'node-cron';

import { AppLogger, WorkerHelper } from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';
import { ApplicationAnalysisQueueService } from '../queues/ApplicationAnalysisQueueService.ts';

const { forkWorker } = WorkerHelper;
const { currentConfig } = ServerConfig;

/**
 * Start the workers that will update the database.
 */
const startUpdateWorkers = (applicationAnalysisQueueService: ApplicationAnalysisQueueService) => {
    (async () => {
        // *********************************************** Update APP List ***********************************************
        await applicationAnalysisQueueService.enqueueStartupAnalysis();

        // *********************************************** Update Keywords List ******************************************
        await forkWorker('./src/workers/KeywordWorker.ts', currentConfig as WorkerOptions); // Start worker thread

        // *********************************************** Update Evolutions List ******************************************
        await forkWorker('./src/workers/EvolutionWorker.ts', currentConfig as WorkerOptions); // Start worker thread
    })();
};

/**
 * Database updates are performed by default at startup, then every midnight.
 */
const start = (applicationAnalysisQueueService: ApplicationAnalysisQueueService | null) => {
    if (!applicationAnalysisQueueService) {
        AppLogger.warn('[DataUpdateScheduler] Application analysis queue is unavailable.');
        return;
    }

    // Initial update
    AppLogger.info('******************** Starting initial update **************************');
    setTimeout(() => {
        startUpdateWorkers(applicationAnalysisQueueService);
    }, 2000); // Delay the initial update by 2 seconds

    // Schedule periodic updates (every midnight)
    const job = CronJob.schedule('00 00 00 * * *', () => {
        AppLogger.info('******************** Starting scheduled update **************************');
        startUpdateWorkers(applicationAnalysisQueueService);
    });
    job.start();
};

const DataUpdateScheduler = {
    start,
};

export default DataUpdateScheduler;
