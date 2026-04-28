import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, PerformancesUtils } from '@v6y/core-logic';

import EcoIndexAuditor from '../auditors/lighthouse/EcoIndexAuditor.ts';

AppLogger.info('******************** Starting Ecoindex Audit **************************');

try {
    const { applicationId, chromeExecutablePath } = workerData || {};
    AppLogger.info(`[EcoIndexAnalysisWorker] applicationId:  ${applicationId}`);

    await DataBaseManager.connect();

    PerformancesUtils.startMeasure('EcoIndexAnalysisWorker-startAuditorAnalysis');
    await EcoIndexAuditor.startAuditorAnalysis({
        applicationId,
        browserPath: chromeExecutablePath,
    });
    PerformancesUtils.endMeasure('EcoIndexAnalysisWorker-startAuditorAnalysis');

    AppLogger.info(
        '******************** Ecoindex Audit completed successfully ********************',
    );
    parentPort?.postMessage('Audit have completed.');
} catch (error) {
    AppLogger.error('[EcoIndexAnalysisWorker] An exception occurred during the audits:', error);
    parentPort?.postMessage('Audit encountered an error.');
}
