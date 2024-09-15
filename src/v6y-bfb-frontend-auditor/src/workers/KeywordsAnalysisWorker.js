import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/commons';
import { parentPort, workerData } from 'worker_threads';

import KeywordsAuditor from '../auditors/keywords/KeywordsAuditor.js';

AppLogger.info('******************** Starting background analysis **************************');

try {
    const { applicationId, workspaceFolder } = workerData || {};
    AppLogger.info(`[KeywordsAnalysisWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[KeywordsAnalysisWorker] workspaceFolder:  ${workspaceFolder}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Keywords Analysis Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('KeywordsAnalysisWorker-startAuditorAnalysis');
    await KeywordsAuditor.startAuditorAnalysis({ applicationId, workspaceFolder });
    PerformancesUtils.endMeasure('KeywordsAnalysisWorker-startAuditorAnalysis');

    AppLogger.info(
        '******************** Keywords Analysis  completed successfully ********************',
    );
    parentPort.postMessage('Keywords Analysis have completed.');
} catch (error) {
    AppLogger.error('[KeywordsAnalysisWorker] An exception occurred during the analysis:', error);
    parentPort.postMessage('Keywords Analysis  encountered an error.'); // Notify the parent of the error
}
