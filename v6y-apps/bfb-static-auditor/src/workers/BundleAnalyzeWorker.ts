import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';
import { parentPort, workerData } from 'worker_threads';

import BundleAnalyzeAuditor from '../auditors/bundle-analyzer/BundleAnalyzeAuditor.ts';

AppLogger.info('******************** Starting background Audit **************************');

try {
    const { applicationId, workspaceFolder } = workerData || {};
    AppLogger.info(`[BundleAnalyzeWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[BundleAnalyzeWorker] workspaceFolder:  ${workspaceFolder}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Audit Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('BundleAnalyzeWorker-startAuditorAnalysis');
    await BundleAnalyzeAuditor.startAuditorAnalysis({
        applicationId,
        workspaceFolder,
    });
    PerformancesUtils.endMeasure('BundleAnalyzeWorker-startAuditorAnalysis');

    AppLogger.info('******************** Audit completed successfully ********************');
    parentPort?.postMessage('Audit have completed.');
} catch (error) {
    AppLogger.error('[BundleAnalyzeWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage('Audit encountered an error.'); // Notify the parent of the error
}
