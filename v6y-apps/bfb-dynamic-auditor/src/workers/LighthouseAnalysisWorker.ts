import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';

import LighthouseAuditor from '../auditors/lighthouse/LighthouseAuditor.ts';

AppLogger.info('******************** Starting background Audit **************************');

try {
    const { applicationId, workspaceFolder, chromeExecutablePath, auditRunId } = workerData || {};
    AppLogger.info(`[LighthouseAnalysisWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[LighthouseAnalysisWorker] workspaceFolder:  ${workspaceFolder}`);
    AppLogger.info(`[LighthouseAnalysisWorker] auditRunId:  ${auditRunId}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Audit Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('LighthouseAnalysisWorker-startAuditorAnalysis');
    await LighthouseAuditor.startAuditorAnalysis({
        applicationId,
        auditRunId,
        browserPath: chromeExecutablePath,
    });
    PerformancesUtils.endMeasure('LighthouseAnalysisWorker-startAuditorAnalysis');

    AppLogger.info('******************** Audit completed successfully ********************');
    parentPort?.postMessage('Audit have completed.');
} catch (error) {
    AppLogger.error('[LighthouseAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage('Audit encountered an error.'); // Notify the parent of the error
}
