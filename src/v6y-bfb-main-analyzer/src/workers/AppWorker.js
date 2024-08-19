import {
    AppLogger,
    AppProvider,
    AuditsProvider,
    DataBaseManager,
    KeywordProvider,
} from '@v6y/commons';
import { parentPort, workerData } from 'worker_threads';

import AppManager from '../managers/AppManager.js';

const { buildAppList } = AppManager;

AppLogger.info('******************** Starting background APP updates **************************');

try {
    const { databaseUri } = workerData || {};

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect(databaseUri);

    // Clear existing data in preparation for updates
    await KeywordProvider.deleteKeywordsList();
    await AuditsProvider.deleteAuditsList();
    await AppProvider.deleteAppList();

    // *********************************************** Update APP List ***********************************************
    await buildAppList({
        enablePersist: true,
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
