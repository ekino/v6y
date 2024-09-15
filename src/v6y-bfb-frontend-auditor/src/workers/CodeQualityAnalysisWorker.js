import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/commons';
import { parentPort, workerData } from 'worker_threads';

import CodeComplexityAuditor from '../auditors/code-complexity/CodeComplexityAuditor.js';
import CodeCouplingAuditor from '../auditors/code-coupling/CodeCouplingAuditor.js';
import CodeDuplicationAuditor from '../auditors/code-duplication/CodeDuplicationAuditor.js';
import CodeModularityAuditor from '../auditors/code-modularity/CodeModularityAuditor.js';
import CodeSecurityAuditor from '../auditors/code-security/CodeSecurityAuditor.js';

AppLogger.info('******************** Starting background Audit **************************');

try {
    const { applicationId, workspaceFolder } = workerData || {};
    AppLogger.info(`[CodeQualityAnalysisWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[CodeQualityAnalysisWorker] workspaceFolder:  ${workspaceFolder}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Audit Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('CodeQualityAnalysisWorker-startAuditorAnalysis');
    await CodeComplexityAuditor.startAuditorAnalysis({ applicationId, workspaceFolder });
    await CodeCouplingAuditor.startAuditorAnalysis({ applicationId, workspaceFolder });
    await CodeDuplicationAuditor.startAuditorAnalysis({ applicationId, workspaceFolder });
    await CodeModularityAuditor.startAuditorAnalysis({ applicationId, workspaceFolder });
    await CodeSecurityAuditor.startAuditorAnalysis({ applicationId, workspaceFolder });
    PerformancesUtils.endMeasure('CodeQualityAnalysisWorker-startAuditorAnalysis');

    AppLogger.info('******************** Audit completed successfully ********************');
    parentPort.postMessage('Audit have completed.');
} catch (error) {
    AppLogger.error('[CodeQualityAnalysisWorker] An exception occurred during the audits:', error);
    parentPort.postMessage('Audit encountered an error.'); // Notify the parent of the error
}
