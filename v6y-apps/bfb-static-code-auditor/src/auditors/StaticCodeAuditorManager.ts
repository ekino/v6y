import { AppLogger, WorkerHelper } from '@v6y/core-logic';

import ServerConfig from '../commons/ServerConfig.ts';
import { AuditCommonsType } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;
const { getCurrentConfig } = ServerConfig;

const startStaticCodeAudit = async ({ applicationId, workspaceFolder }: AuditCommonsType) => {
    try {
        AppLogger.info(
            '[StaticCodeAuditorManager - startStaticCodeAudit] applicationId: ',
            applicationId,
        );
        AppLogger.info(
            '[StaticCodeAuditorManager - startStaticCodeAudit] workspaceFolder: ',
            workspaceFolder,
        );

        // Start audits in a worker thread to prevent blocking the main thread
        const currentConfig = getCurrentConfig();
        const workerConfig = {
            ...currentConfig,
            applicationId,
            workspaceFolder,
        } as WorkerOptions;

        await forkWorker('./src/workers/CodeQualityAnalysisWorker.ts', workerConfig);
        AppLogger.info(
            '[StaticCodeAuditorManager - startStaticCodeAudit] CodeQuality Audit have completed successfully.',
        );

        await forkWorker('./src/workers/DependenciesAnalysisWorker.ts', workerConfig);
        AppLogger.info(
            '[StaticCodeAuditorManager - startStaticCodeAudit] Dependencies Audit have completed successfully.',
        );

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.info(
            '[StaticCodeAuditorManager - startStaticCodeAudit] An exception occurred during the app audits: ',
            error,
        );
        return false; // Indicates failure to initiate audits
    }
};

const StaticCodeAuditorManager = {
    startStaticCodeAudit,
};

export default StaticCodeAuditorManager;
