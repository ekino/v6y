import { AppLogger, WorkerHelper } from '@v6y/core-logic';

import ServerConfig from '../commons/ServerConfig.ts';
import { AuditCommonsType } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;
const { currentConfig } = ServerConfig;

const startStaticAudit = async ({ applicationId, workspaceFolder }: AuditCommonsType) => {
    try {
        AppLogger.info('[StaticAuditorManager - startStaticAudit] applicationId: ', applicationId);
        AppLogger.info(
            '[StaticAuditorManager - startStaticAudit] workspaceFolder: ',
            workspaceFolder,
        );

        // Start audits in a worker thread to prevent blocking the main thread
        const workerConfig = {
            ...currentConfig,
            applicationId,
            workspaceFolder,
        } as WorkerOptions;

        await forkWorker('./src/workers/CodeQualityAnalysisWorker.ts', workerConfig);
        AppLogger.info(
            '[StaticAuditorManager - startStaticAudit] CodeQuality Audit have completed successfully.',
        );

        await forkWorker('./src/workers/DependenciesAnalysisWorker.ts', workerConfig);
        AppLogger.info(
            '[StaticAuditorManager - startStaticAudit] Dependencies Audit have completed successfully.',
        );

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.info(
            '[StaticAuditorManager - startStaticAudit] An exception occurred during the app audits: ',
            error,
        );
        return false; // Indicates failure to initiate audits
    }
};

const StaticAuditorManager = {
    startStaticAudit,
};

export default StaticAuditorManager;
