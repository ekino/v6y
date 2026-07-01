import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';

import CodeComplexityAuditor from '../auditors/code-complexity/CodeComplexityAuditor.ts';
import CodeCouplingAuditor from '../auditors/code-coupling/CodeCouplingAuditor.ts';
import CodeDuplicationAuditor from '../auditors/code-duplication/CodeDuplicationAuditor.ts';
import CodeModularityAuditor from '../auditors/code-modularity/CodeModularityAuditor.ts';
import CodeSecurityAuditor from '../auditors/code-security/CodeSecurityAuditor.ts';
import CreedengoAuditor from '../auditors/ecological-impact/CreedengoAuditor.ts';

AppLogger.info('******************** Starting background Audit **************************');

try {
    const { applicationId, workspaceFolder, auditRunId } = workerData || {};
    AppLogger.info(`[CodeQualityAnalysisWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[CodeQualityAnalysisWorker] workspaceFolder:  ${workspaceFolder}`);
    AppLogger.info(`[CodeQualityAnalysisWorker] auditRunId:  ${auditRunId}`);

    await DataBaseManager.connect();

    PerformancesUtils.startMeasure('CodeQualityAnalysisWorker-startAuditorAnalysis');
    await CodeComplexityAuditor.startAuditorAnalysis({
        applicationId,
        workspaceFolder,
        auditRunId,
    });
    await CodeCouplingAuditor.startAuditorAnalysis({
        applicationId,
        workspaceFolder,
        auditRunId,
    });
    await CodeDuplicationAuditor.startAuditorAnalysis({
        applicationId,
        workspaceFolder,
        auditRunId,
    });
    await CodeModularityAuditor.startAuditorAnalysis({
        applicationId,
        workspaceFolder,
        auditRunId,
    });
    await CodeSecurityAuditor.startAuditorAnalysis({
        applicationId,
        workspaceFolder,
        auditRunId,
    });
    await CreedengoAuditor.startAuditorAnalysis({
        applicationId,
        workspaceFolder,
        auditRunId,
    });

    PerformancesUtils.endMeasure('CodeQualityAnalysisWorker-startAuditorAnalysis');

    AppLogger.info('******************** Audit completed successfully ********************');
    parentPort?.postMessage('Audit have completed.');
} catch (error) {
    AppLogger.error('[CodeQualityAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage('Audit encountered an error.'); // Notify the parent of the error
}
