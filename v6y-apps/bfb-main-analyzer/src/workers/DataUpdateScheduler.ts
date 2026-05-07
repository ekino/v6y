import CronJob from 'node-cron';

import { AppLogger, WorkerHelper } from '@v6y/core-logic';

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

        // *********************************************** Update Keywords List ******************************************
        await forkWorker('./src/workers/KeywordWorker.ts', currentConfig as WorkerOptions); // Start worker thread

        // *********************************************** Update Evolutions List ******************************************
        await forkWorker('./src/workers/EvolutionWorker.ts', currentConfig as WorkerOptions); // Start worker thread
    })();
};

/**
 * Database updates are performed by default at startup, then every midnight.
 */
const start = () => {
    // Initial update
    AppLogger.info('******************** Starting initial update **************************');
    setTimeout(() => {
        AppLogger.info('[DataUpdateScheduler] Starting initial data update...');
        startUpdateWorkers();
    }, 2000);

    const job = CronJob.schedule('00 00 00 * * *', () => {
        AppLogger.info('[DataUpdateScheduler] Starting scheduled data update...');
        startUpdateWorkers();
    });
    job.start();
};

const DataUpdateScheduler = {
    start,
};

export default DataUpdateScheduler;
