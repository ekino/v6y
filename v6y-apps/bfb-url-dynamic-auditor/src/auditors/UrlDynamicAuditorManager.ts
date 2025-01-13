import { AppLogger, WorkerHelper } from '@v6y/core-logic';

import ServerConfig from '../commons/ServerConfig.ts';
import { AuditCommonsType } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;
const { getCurrentConfig } = ServerConfig;

const startUrlDynamicAudit = async ({ applicationId }: AuditCommonsType) => {
    try {
        AppLogger.info(
            '[UrlDynamicAuditorManager - startUrlDynamicAudit] applicationId: ',
            applicationId,
        );

        // Start audits in a worker thread to prevent blocking the main thread
        const currentConfig = getCurrentConfig();
        const workerConfig = {
            ...currentConfig,
            applicationId,
        };

        // start Lighthouse analysis
        await forkWorker(
            './src/workers/LighthouseAnalysisWorker.ts',
            workerConfig as WorkerOptions,
        );
        AppLogger.info(
            '[UrlDynamicAuditorManager - startUrlDynamicAudit] Lighthouse Audit have completed successfully.',
        );

        // start other dynamic analysis

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.info(
            '[UrlDynamicAuditorManager - startUrlDynamicAudit] An exception occurred during the app audits: ',
            error,
        );
        return false; // Indicates failure to initiate audits
    }
};

const UrlDynamicAuditorManager = {
    startUrlDynamicAudit,
};

export default UrlDynamicAuditorManager;
