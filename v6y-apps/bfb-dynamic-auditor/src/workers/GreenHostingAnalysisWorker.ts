import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';

import GreenHostingAuditor from '../auditors/green-hosting/GreenHostingAuditor.ts';

AppLogger.info('******************** Starting Green Hosting Audit **************************');

try {
    const { applicationId } = workerData || {};
    AppLogger.info(`[GreenHostingAnalysisWorker] applicationId: ${applicationId}`);

    await DataBaseManager.connect();

    PerformancesUtils.startMeasure('GreenHostingAnalysisWorker-startAuditorAnalysis');
    await GreenHostingAuditor.startAuditorAnalysis({ applicationId });
    PerformancesUtils.endMeasure('GreenHostingAnalysisWorker-startAuditorAnalysis');

    AppLogger.info('******************** Green Hosting Audit completed ********************');
    parentPort?.postMessage('Audit have completed.');
} catch (error) {
    AppLogger.error('[GreenHostingAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage('Audit encountered an error.');
}
