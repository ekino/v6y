import {
    AppLogger,
    ApplicationProvider,
    AuditProvider,
    DataBaseManager,
    DependencyProvider,
    EvolutionProvider,
    KeywordProvider,
} from '@v6y/commons';
import { parentPort } from 'worker_threads';

import AppManager from '../managers/AppManager.js';

const { buildAppList } = AppManager;

AppLogger.info('******************** Starting background APP updates **************************');

try {
    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // Clear existing data in preparation for updates
    await KeywordProvider.deleteKeywordList();
    await AuditProvider.deleteAuditList();
    await DependencyProvider.deleteDependencyList();
    await EvolutionProvider.deleteEvolutionList();
    await ApplicationProvider.deleteApplicationList();

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
