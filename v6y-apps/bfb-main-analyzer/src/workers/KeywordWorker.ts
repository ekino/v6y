import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, KeywordProvider, PerformancesUtils } from '@v6y/core-logic';

import KeywordManager from '../managers/KeywordManager.ts';

AppLogger.info('******************** Starting background analysis **************************');

try {
    const { applicationId, workspaceFolder } = workerData || {};
    AppLogger.info(`[KeywordWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[KeywordWorker] workspaceFolder:  ${workspaceFolder}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // Clear dynamic data in preparation for updates
    await KeywordProvider.deleteKeywordList();

    // *********************************************** Keywords Analysis Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('KeywordWorker-startAuditorAnalysis');
    await KeywordManager.buildKeywordList();
    PerformancesUtils.endMeasure('KeywordWorker-startAuditorAnalysis');

    AppLogger.info(
        '******************** Keywords Analysis  completed successfully ********************',
    );
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    parentPort.postMessage('Keywords Analysis have completed.');
} catch (error) {
    AppLogger.error('[KeywordWorker] An exception occurred during the analysis:', error);
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    parentPort.postMessage('Keywords Analysis  encountered an error.'); // Notify the parent of the error
}
