import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/commons';
import { parentPort, workerData } from 'worker_threads';

import EvolutionsAuditor from '../auditors/evolutions/EvolutionsAuditor.js';

AppLogger.info('******************** Starting background analysis **************************');

try {
    const { applicationId, workspaceFolder } = workerData || {};
    AppLogger.info(`[EvolutionsAnalysisWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[EvolutionsAnalysisWorker] workspaceFolder:  ${workspaceFolder}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Evolution Analysis Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('EvolutionsAnalysisWorker-startAuditorAnalysis');
    await EvolutionsAuditor.startAuditorAnalysis({ applicationId, workspaceFolder });
    PerformancesUtils.endMeasure('EvolutionsAnalysisWorker-startAuditorAnalysis');

    AppLogger.info(
        '******************** Evolution Analysis  completed successfully ********************',
    );
    parentPort.postMessage('Evolution Analysis have completed.');
} catch (error) {
    AppLogger.error('[EvolutionsAnalysisWorker] An exception occurred during the analysis:', error);
    parentPort.postMessage('Evolution Analysis  encountered an error.'); // Notify the parent of the error
}
