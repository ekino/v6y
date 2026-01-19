import { parentPort } from 'worker_threads';

import { AppLogger, AuditProvider, DataBaseManager, DependencyProvider } from '@v6y/core-logic';

import ApplicationManager from '../managers/ApplicationManager.ts';

const { buildApplicationList } = ApplicationManager;

AppLogger.info('******************** Starting background APP updates **************************');

try {
    // *********************************************** Database Configuration and Connection ***********************************************
    AppLogger.info('[ApplicationWorker] Connecting to database...');
    await DataBaseManager.connect();
    AppLogger.info('[ApplicationWorker] Database connected successfully');

    // Clear dynamic data in preparation for updates
    AppLogger.info('[ApplicationWorker] Clearing existing audit data...');
    await AuditProvider.deleteAuditList();
    AppLogger.info('[ApplicationWorker] Clearing existing dependency data...');
    await DependencyProvider.deleteDependencyList();
    AppLogger.info('[ApplicationWorker] Data cleanup completed');

    // *********************************************** Update APP List ***********************************************
    AppLogger.info('[ApplicationWorker] Starting application list build...');
    const buildResult = await buildApplicationList();
    AppLogger.info(
        `[ApplicationWorker] Application list build completed with result: ${buildResult}`,
    );

    if (buildResult) {
        AppLogger.info(
            '******************** APP update completed successfully ********************',
        );
        parentPort?.postMessage('SUCCESS: APP update completed successfully');
    } else {
        AppLogger.error(
            '******************** APP update completed with failures ********************',
        );
        parentPort?.postMessage(
            'PARTIAL_SUCCESS: APP update completed but some applications failed',
        );
    }
} catch (error) {
    AppLogger.error(`[ApplicationWorker] Critical error during app list build:`, error);
    AppLogger.error('******************** APP update failed ********************');
    parentPort?.postMessage(
        `ERROR: APP update failed - ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
}
