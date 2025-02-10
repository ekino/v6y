import { AppLogger, WorkerHelper } from '@v6y/core-logic';

import ServerConfig from '../commons/ServerConfig.ts';
import { AuditCommonsType } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;
const { currentConfig } = ServerConfig;

const startDynamicAudit = async ({ applicationId }: AuditCommonsType) => {
    try {
        AppLogger.info(
            '[DynamicAuditorManager - startDynamicAudit] applicationId: ',
            applicationId,
        );

        // Start audits in a worker thread to prevent blocking the main thread
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
            '[DynamicAuditorManager - startDynamicAudit] Lighthouse Audit have completed successfully.',
        );

        // start other dynamic analysis

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.info(
            '[DynamicAuditorManager - startDynamicAudit] An exception occurred during the app audits: ',
            error,
        );
        return false; // Indicates failure to initiate audits
    }
};

const DynamicAuditorManager = {
    startDynamicAudit,
};

export default DynamicAuditorManager;
