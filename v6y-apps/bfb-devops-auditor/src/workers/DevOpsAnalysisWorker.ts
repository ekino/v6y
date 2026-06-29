import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';

import DoraMetricsAuditor from '../auditors/dora-metrics/DoraMetricsAuditor.ts';

AppLogger.info('******************** Starting background Audit **************************');

type DevOpsWorkerResult = {
    status: 'success' | 'failed';
    message: string;
};

try {
    const { applicationId, auditRunId } = workerData || {};
    AppLogger.info(`[DoraMetricsAnalysisWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[DoraMetricsAnalysisWorker] auditRunId:  ${auditRunId}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Audit Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('DoraMetricsAnalysisWorker-startAuditorAnalysis');

    const result = await DoraMetricsAuditor.startAuditorAnalysis({
        applicationId,
        auditRunId,
    });

    PerformancesUtils.endMeasure('DoraMetricsAnalysisWorker-startAuditorAnalysis');

    if (!result) {
        AppLogger.error('******************** Audit failed ********************');
        parentPort?.postMessage({
            status: 'failed',
            message: 'Audit failed.',
        } as DevOpsWorkerResult);
    } else {
        AppLogger.info('******************** Audit completed successfully ********************');

        parentPort?.postMessage({
            status: 'success',
            message: 'Audit completed successfully.',
        } as DevOpsWorkerResult);
    }
} catch (error) {
    AppLogger.error('[DoraMetricsAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage({
        status: 'failed',
        message: 'Audit encountered an error.',
    } as DevOpsWorkerResult);
}
