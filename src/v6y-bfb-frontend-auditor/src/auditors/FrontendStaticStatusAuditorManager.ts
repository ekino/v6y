import { AppLogger, WorkerHelper } from '@v6y/commons';

import ServerConfig from '../commons/ServerConfig.ts';
import { AuditCommonsType } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;
const { getCurrentConfig } = ServerConfig;

const startFrontendStaticAudit = async ({ applicationId, workspaceFolder }: AuditCommonsType) => {
    try {
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendStaticAudit] applicationId: ',
            applicationId,
        );
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendStaticAudit] workspaceFolder: ',
            workspaceFolder,
        );

        // Start audits in a worker thread to prevent blocking the main thread
        const currentConfig = getCurrentConfig();
        const workerConfig = {
            ...currentConfig,
            applicationId,
            workspaceFolder,
        };

        await forkWorker(
            './src/workers/CodeQualityAnalysisWorker.ts',
            workerConfig as WorkerOptions,
        );
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendStaticAudit] CodeQuality Audit have completed successfully.',
        );

        await forkWorker(
            './src/workers/DependenciesAnalysisWorker.ts',
            workerConfig as WorkerOptions,
        );
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendStaticAudit] Dependencies Audit have completed successfully.',
        );

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.info(
            '[FrontendAuditorManager - startFrontendStaticAudit] An exception occurred during the app audits: ',
            error,
        );
        return false; // Indicates failure to initiate audits
    }
};

const FrontendStaticStatusAuditorManager = {
    startFrontendStaticAudit,
};

export default FrontendStaticStatusAuditorManager;
