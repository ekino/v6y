import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';

import DoraMetricsAuditor from '../auditors/dora-metrics/DoraMetricsAuditor.ts';
import { AuditOutcome } from '../auditors/types/AuditCommonsType.ts';

AppLogger.info('******************** Starting background Audit **************************');

try {
    const { applicationId, auditRunId } = workerData || {};
    AppLogger.info(`[DoraMetricsAnalysisWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[DoraMetricsAnalysisWorker] auditRunId:  ${auditRunId}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Audit Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('DoraMetricsAnalysisWorker-startAuditorAnalysis');

    const outcome = await DoraMetricsAuditor.startAuditorAnalysis({
        applicationId,
        auditRunId,
    });

    PerformancesUtils.endMeasure('DoraMetricsAnalysisWorker-startAuditorAnalysis');

    if (outcome.status === 'failed') {
        AppLogger.error('******************** Audit failed ********************');
    } else if (outcome.status === 'skipped') {
        AppLogger.warn(
            `******************** Audit skipped: ${outcome.message} ********************`,
        );
    } else {
        AppLogger.info('******************** Audit completed successfully ********************');
    }

    parentPort?.postMessage(outcome satisfies AuditOutcome);
} catch (error) {
    AppLogger.error('[DoraMetricsAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage({
        status: 'failed',
        message: 'Audit encountered an error.',
    } satisfies AuditOutcome);
}
