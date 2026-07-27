import CronJob from 'node-cron';

import { AppLogger } from '@v6y/core-logic';

import { DataUpdateQueueService } from '../queues/DataUpdateQueueService.ts';

/**
 * Enqueue the database refreshes.
 *
 * Every unit of work now goes through the data-update queue, so this only writes
 * three jobs to Redis and returns: it no longer forks worker threads itself, and a
 * failing refresh is retried with backoff by BullMQ instead of surfacing as an
 * unhandled rejection that terminates the process. The jobs still run one after
 * another, since a single queue processes them sequentially.
 */
const startUpdateWorkers = async (dataUpdateQueueService: DataUpdateQueueService) => {
    try {
        // *********************************************** Update APP List ***********************************************
        await dataUpdateQueueService.enqueueApplicationListUpdate();

        // *********************************************** Update Keywords List ******************************************
        await dataUpdateQueueService.enqueueKeywordUpdate();

        // *********************************************** Update Evolutions List ******************************************
        await dataUpdateQueueService.enqueueEvolutionUpdate();
    } catch (error) {
        AppLogger.error('[DataUpdateScheduler] Failed to enqueue the data updates: ', error);
    }
};

/**
 * Database updates are performed by default at startup, then every midnight.
 */
const start = (dataUpdateQueueService: DataUpdateQueueService) => {
    // Initial update
    AppLogger.info('******************** Starting initial update **************************');
    setTimeout(() => {
        void startUpdateWorkers(dataUpdateQueueService);
    }, 2000); // Delay the initial update by 2 seconds

    const job = CronJob.schedule('00 00 00 * * *', () => {
        AppLogger.info('******************** Starting scheduled update **************************');
        void startUpdateWorkers(dataUpdateQueueService);
    });
    job.start();
};

const DataUpdateScheduler = {
    start,
};

export default DataUpdateScheduler;
