import { AppLogger, WorkerHelper } from '@v6y/commons';

import ServerConfig from '../commons/ServerConfig.ts';
import { AuditCommonsType } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;
const { getCurrentConfig } = ServerConfig;

const startFrontendDynamicAudit = async ({ applicationId }: AuditCommonsType) => {
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

        await forkWorker(
            './src/workers/LighthouseAnalysisWorker.ts',
            workerConfig as WorkerOptions,
        );

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
