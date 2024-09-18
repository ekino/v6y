import { AppLogger, WorkerHelper } from '@v6y/commons';
import { CronJob } from 'cron';

import ServerConfig from '../config/ServerConfig.js';

const { forkWorker } = WorkerHelper;
const { getCurrentConfig } = ServerConfig;

// Function to initiate the background workers (presumably for updating data)
const startUpdateWorkers = () => {
    (async () => {
        const currentConfig = getCurrentConfig();

        // *********************************************** Update APP List ***********************************************
        await forkWorker('./src/workers/ApplicationWorker.js', currentConfig); // Start worker thread

        // *********************************************** Update Keywords & Evolutions List ******************************************
        await forkWorker('./src/workers/KeywordEvolutionWorker.js', currentConfig); // Start worker thread
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
    const job = new CronJob('00 00 00 * * *', () => {
        AppLogger.info('******************** Starting scheduled update **************************');
        startUpdateWorkers();
    });
    job.start();
};

const DataUpdateScheduler = {
    start,
};

export default DataUpdateScheduler;
