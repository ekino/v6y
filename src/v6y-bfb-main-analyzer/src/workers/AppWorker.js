import { workerData, parentPort } from 'worker_threads';
import {
  AppLogger,
  DataBaseManager,
  AppProvider,
  KeywordsProvider,
  AuditsProvider,
} from '@v6y/commons';
import AppManager from '../managers/AppManager.js';

const { buildAppList } = AppManager;

AppLogger.info(
  '******************** Starting background APP updates **************************',
);

try {
  const { databaseUri } = workerData || {};

  // *********************************************** Database Configuration and Connection ***********************************************
  await DataBaseManager.connect(databaseUri);

  // Clear existing data in preparation for updates
  await KeywordsProvider.deleteKeywordsList();
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

AppLogger.info(
  '******************** APP update completed successfully ********************',
);
parentPort.postMessage(
  '******************** APP update completed successfully ********************',
);
