import { parentPort } from 'worker_threads';

import { AppLogger, AuditProvider, DataBaseManager, DependencyProvider } from '@v6y/core-logic';

import ApplicationManager from '../managers/ApplicationManager.ts';

const { buildApplicationList } = ApplicationManager;

AppLogger.info('******************** Starting background APP updates **************************');

try {
    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // Clear dynamic data in preparation for updates
    await AuditProvider.deleteAuditList();
    await DependencyProvider.deleteDependencyList();

    // *********************************************** Update APP List ***********************************************
    await buildApplicationList();
} catch (error) {
    AppLogger.info(`[createOrUpdateAppList] error : ${error}`);
}

AppLogger.info('******************** APP update completed successfully ********************');

parentPort?.postMessage(
    '******************** APP update completed successfully ********************',
);
