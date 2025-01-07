import { AppLogger, WorkerHelper } from '@v6y/commons';

import ServerConfig from '../commons/ServerConfig.ts';
import { AuditCommonsType } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;
const { getCurrentConfig } = ServerConfig;

const startDevOpsAudit = async ({ applicationId }: AuditCommonsType) => {
    try {
        AppLogger.info('[DevOpsAuditorManager - startDevOpsAudit] applicationId: ', applicationId);

        // Start audits in a worker thread to prevent blocking the main thread
        const currentConfig = getCurrentConfig();
        const workerConfig = {
            ...currentConfig,
            applicationId,
        } as WorkerOptions;

        await forkWorker('./src/workers/DevOpsAnalysisWorker.ts', workerConfig);

        AppLogger.info(
            '[DevOpsAuditorManager - startDevOpsAudit] DevOps Audit have completed successfully.',
        );

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.info(
            '[DevOpsAuditorManager - startDevOpsAudit] An exception occurred during the app audits: ',
            error,
        );
        return false; // Indicates failure to initiate audits
    }
};

const DevOpsAuditorManager = {
    startDevOpsAudit,
};

export default DevOpsAuditorManager;