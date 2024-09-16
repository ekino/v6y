import {
    AppLogger,
    AuditProvider,
    DataBaseManager,
    DependencyProvider,
    EvolutionProvider,
    KeywordProvider,
} from '@v6y/commons';
import { parentPort } from 'worker_threads';

import ApplicationManager from '../managers/ApplicationManager.js';

const { buildApplicationList } = ApplicationManager;

AppLogger.info('******************** Starting background APP updates **************************');

try {
    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // Clear dynamic data in preparation for updates
    await AuditProvider.deleteAuditList();
    await DependencyProvider.deleteDependencyList();

    // *********************************************** Update APP List ***********************************************
    await buildApplicationList({
        // start: 0, // Optionally limit analysis range (start index)
        // end: 5,   // Optionally limit analysis range (end index)
    });
} catch (error) {
    AppLogger.info(`[createOrUpdateAppList] error : ${error.message}`);
}

AppLogger.info('******************** APP update completed successfully ********************');
parentPort.postMessage(
    '******************** APP update completed successfully ********************',
);
