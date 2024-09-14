import { AppLogger, WorkerHelper } from '@v6y/commons';

import ServerConfig from '../commons/ServerConfig.js';

const { forkWorker } = WorkerHelper;
const { getCurrentConfig } = ServerConfig;

/**
 * Starts frontend audit process for the given application.
 * @returns {Promise<boolean>} Indicates whether the audit process was initiated successfully.
 */
const startFrontendAudit = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendAudit] applicationId: ',
            applicationId,
        );
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendAudit] workspaceFolder: ',
            workspaceFolder,
        );

        // Start audits in a worker thread to prevent blocking the main thread
        const currentConfig = getCurrentConfig();
        const workerConfig = {
            ...currentConfig,
            applicationId,
            workspaceFolder,
        };

        await forkWorker('./src/workers/DependenciesAnalysisWorker.js', workerConfig);
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendAudit] Dependencies Audit have completed successfully.',
        );

        await forkWorker('./src/workers/CodeQualityAnalysisWorker.js', workerConfig);
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendAudit] CodeQuality Audit have completed successfully.',
        );

        await forkWorker('./src/workers/LighthouseAnalysisWorker.js', workerConfig);
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendAudit] Lighthouse Audit have completed successfully.',
        );

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendAudit] An exception occurred during the app audits: ',
            error,
        );
        return false; // Indicates failure to initiate audits
    }
};

const FrontendAuditorManager = {
    startFrontendAudit,
};

export default FrontendAuditorManager;
