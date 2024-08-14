import { AppLogger, WorkerHelper } from '@v6y/commons';

import ServerConfig from '../commons/ServerConfig.js';

const { forkWorker } = WorkerHelper;
const { getCurrentConfig } = ServerConfig;

/**
 * Starts audits on applications.
 * @return {boolean} Indicates whether the audit process was initiated successfully.
 */
const startAudits = () => {
    try {
        // Start audits in a worker thread to prevent blocking the main thread
        const currentConfig = getCurrentConfig();

        forkWorker('./src/workers/AppsAuditorWorker.js', currentConfig)
            .then(() => {
                AppLogger.info(
                    '[AppAuditorManager - startAudits] App audits have completed successfully.',
                );
            })
            .catch((error) => {
                AppLogger.info(
                    `[AppAuditorManager - startAudits] An error occurred during the app audits: ${error?.message}`,
                );
            });

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.info(
            '[AppAuditorManager - startAudits] An exception occurred during the app audits: ',
            error,
        );
        return false; // Indicates failure to initiate audits
    }
};

const AppAuditorManager = {
    startAudits,
};

export default AppAuditorManager;
