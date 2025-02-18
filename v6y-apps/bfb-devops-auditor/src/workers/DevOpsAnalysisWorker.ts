import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';
import { parentPort, workerData } from 'worker_threads';

import DoraMetricsAuditor from '../auditors/dora-metrics/DoraMetricsAuditor.ts';

AppLogger.info('******************** Starting background Audit **************************');

try {
    const { applicationId } = workerData || {};
    AppLogger.info(`[DoraMetricsAnalysisWorker] applicationId:  ${applicationId}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Audit Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('DoraMetricsAnalysisWorker-startAuditorAnalysis');

    const result = await DoraMetricsAuditor.startAuditorAnalysis({
        applicationId,
    });

    PerformancesUtils.endMeasure('DoraMetricsAnalysisWorker-startAuditorAnalysis');

    if (!result) {
        AppLogger.error('******************** Audit failed ********************');
        parentPort?.postMessage('Audit failed.'); // Notify the parent of the failure
    } else {
        AppLogger.info('******************** Audit completed successfully ********************');

        parentPort?.postMessage('Audit completed successfully.'); // Notify the parent of the success
    }
} catch (error) {
    AppLogger.error('[DoraMetricsAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage('Audit encountered an error.'); // Notify the parent of the error
}
