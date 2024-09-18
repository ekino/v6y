import { AppLogger, WorkerHelper } from '@v6y/commons';

import ServerConfig from '../commons/ServerConfig.js';

const { forkWorker } = WorkerHelper;
const { getCurrentConfig } = ServerConfig;

/**
 * Starts frontend audit process for the given application.
 * @returns {Promise<boolean>} Indicates whether the audit process was initiated successfully.
 */
const startFrontendDynamicAudit = async ({ applicationId }) => {
    try {
        AppLogger.info(
            '[FrontendStaticStatusAuditorManager - startFrontendDynamicAudit] applicationId: ',
            applicationId,
        );

        // Start audits in a worker thread to prevent blocking the main thread
        const currentConfig = getCurrentConfig();
        const workerConfig = {
            ...currentConfig,
            applicationId,
        };

        await forkWorker('./src/workers/LighthouseAnalysisWorker.js', workerConfig);

        AppLogger.info(
            '[FrontendStaticStatusAuditorManager - startFrontendDynamicAudit] Lighthouse Audit have completed successfully.',
        );

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.info(
            '[FrontendStaticStatusAuditorManager - startFrontendDynamicAudit] An exception occurred during the app audits: ',
            error,
        );
        return false; // Indicates failure to initiate audits
    }
};

const FrontendStaticStatusAuditorManager = {
    startFrontendDynamicAudit,
};

export default FrontendStaticStatusAuditorManager;
