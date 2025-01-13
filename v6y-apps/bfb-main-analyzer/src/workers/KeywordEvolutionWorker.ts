import {
    AppLogger,
    DataBaseManager,
    EvolutionProvider,
    KeywordProvider,
    PerformancesUtils,
} from '@v6y/core-logic';
import { parentPort, workerData } from 'worker_threads';

import KeywordEvolutionManager from '../managers/KeywordEvolutionManager.ts';

AppLogger.info('******************** Starting background analysis **************************');

try {
    const { applicationId, workspaceFolder } = workerData || {};
    AppLogger.info(`[KeywordEvolutionWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[KeywordEvolutionWorker] workspaceFolder:  ${workspaceFolder}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // Clear dynamic data in preparation for updates
    await KeywordProvider.deleteKeywordList();
    await EvolutionProvider.deleteEvolutionList();

    // *********************************************** Keywords Analysis Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('KeywordEvolutionWorker-startAuditorAnalysis');
    await KeywordEvolutionManager.buildKeywordEvolutionList();
    PerformancesUtils.endMeasure('KeywordEvolutionWorker-startAuditorAnalysis');

    AppLogger.info(
        '******************** Keywords Analysis  completed successfully ********************',
    );
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    parentPort.postMessage('Keywords Analysis have completed.');
} catch (error) {
    AppLogger.error('[KeywordEvolutionWorker] An exception occurred during the analysis:', error);
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    parentPort.postMessage('Keywords Analysis  encountered an error.'); // Notify the parent of the error
}
