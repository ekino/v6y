import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';

import DependenciesAuditor from '../auditors/dependencies-auditor/DependenciesAuditor.ts';

AppLogger.info('******************** Starting background Audit **************************');

try {
    const { applicationId, workspaceFolder } = workerData || {};
    AppLogger.info(`[DependenciesAnalysisWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[DependenciesAnalysisWorker] workspaceFolder:  ${workspaceFolder}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Audit Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('DependenciesAnalysisWorker-startAuditorAnalysis');
    await DependenciesAuditor.startAuditorAnalysis({
        applicationId,
        workspaceFolder,
    });
    PerformancesUtils.endMeasure('DependenciesAnalysisWorker-startAuditorAnalysis');

    AppLogger.info('******************** Audit completed successfully ********************');
    parentPort?.postMessage('Audit have completed.');
} catch (error) {
    AppLogger.error('[DependenciesAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage('Audit encountered an error.'); // Notify the parent of the error
}
