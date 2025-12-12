import { parentPort, workerData } from 'worker_threads';

import { AppLogger, DataBaseManager, EvolutionProvider, PerformancesUtils } from '@v6y/core-logic';

import EvolutionManager from '../managers/EvolutionManager.ts';

AppLogger.info('******************** Starting background analysis **************************');

try {
    const { applicationId, workspaceFolder } = workerData || {};
    AppLogger.info(`[EvolutionWorker] applicationId:  ${applicationId}`);
    AppLogger.info(`[EvolutionWorker] workspaceFolder:  ${workspaceFolder}`);

    // *********************************************** Database Configuration and Connection ***********************************************
    await DataBaseManager.connect();

    // Clear dynamic data in preparation for updates
    await EvolutionProvider.deleteEvolutionList();

    // *********************************************** Evolutions Analysis Configuration and Launch ***********************************************
    PerformancesUtils.startMeasure('EvolutionWorker-startAuditorAnalysis');
    await EvolutionManager.buildEvolutionList();
    PerformancesUtils.endMeasure('EvolutionWorker-startAuditorAnalysis');

    AppLogger.info(
        '******************** Evolutions Analysis  completed successfully ********************',
    );
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    parentPort.postMessage('Evolutions Analysis have completed.');
} catch (error) {
    AppLogger.error('[EvolutionWorker] An exception occurred during the analysis:', error);
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    parentPort.postMessage('Evolutions Analysis  encountered an error.'); // Notify the parent of the error
}
