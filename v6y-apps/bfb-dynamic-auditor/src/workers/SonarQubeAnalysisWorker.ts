import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';

import SonarQubeAuditorManager from '../auditors/SonarQubeAuditorManager.ts';

AppLogger.info('******************** Starting SonarQube Audit **************************');

try {
    const { applicationId, auditRunId } = workerData || {};
    AppLogger.info(`[SonarQubeAnalysisWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[SonarQubeAnalysisWorker] auditRunId:  ${auditRunId}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // *********************************************** Audit Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('SonarQubeAnalysisWorker-startAuditorAnalysis');
    await SonarQubeAuditorManager.startAuditorAnalysis({ applicationId, auditRunId });
    PerformancesUtils.endMeasure('SonarQubeAnalysisWorker-startAuditorAnalysis');

    AppLogger.info(
        '******************** SonarQube Audit completed successfully ********************',
    );
    parentPort?.postMessage('SonarQube Audit have completed.');
} catch (error) {
    AppLogger.error('[SonarQubeAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage('SonarQube Audit encountered an error.');
}
