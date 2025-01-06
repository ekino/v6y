import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/commons';
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
    await DoraMetricsAuditor.startAuditorAnalysis({
        applicationId,
    });
    PerformancesUtils.endMeasure('DoraMetricsAnalysisWorker-startAuditorAnalysis');

    AppLogger.info('******************** Audit completed successfully ********************');
    parentPort?.postMessage('Audit have completed.');
} catch (error) {
    AppLogger.error('[DoraMetricsAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage('Audit encountered an error.'); // Notify the parent of the error
}
