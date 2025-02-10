import { AppLogger, WorkerHelper } from '@v6y/core-logic';
import CronJob from 'node-cron';

import ServerConfig from '../config/ServerConfig.ts';

const { forkWorker } = WorkerHelper;
const { currentConfig } = ServerConfig;

/**
 * Start the workers that will update the database.
 */
const startUpdateWorkers = () => {
    (async () => {
        // *********************************************** Update APP List ***********************************************
        await forkWorker('./src/workers/ApplicationWorker.ts', currentConfig as WorkerOptions); // Start worker thread

        // *********************************************** Update Keywords & Evolutions List ******************************************
        await forkWorker('./src/workers/KeywordEvolutionWorker.ts', currentConfig as WorkerOptions); // Start worker thread
    })();
};

/**
 * Database updates are performed by default at startup, then every midnight.
 */
const start = () => {
    // Check every second to make sure the main thread is still responsive
    setInterval(() => {
        AppLogger.info(
            '******************** Checking that the main thread is not blocked **************************',
        );
    }, 1000);

    // Initial update
    AppLogger.info('******************** Starting initial update **************************');
    setTimeout(() => {
        startUpdateWorkers();
    }, 2000); // Delay the initial update by 2 seconds

    // Schedule periodic updates (every midnight)
    const job = CronJob.schedule('00 00 00 * * *', () => {
        AppLogger.info('******************** Starting scheduled update **************************');
        startUpdateWorkers();
    });
    job.start();
};

const DataUpdateScheduler = {
    start,
};

export default DataUpdateScheduler;
