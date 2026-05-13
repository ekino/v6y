import { AppLogger, WorkerHelper } from '@v6y/core-logic';

import { AuditCommonsType } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;

const startDynamicAudit = async ({ applicationId, auditRunId }: AuditCommonsType) => {
    try {
        AppLogger.info(
            '[DynamicAuditorManager - startDynamicAudit] applicationId: ',
            applicationId,
        );
        AppLogger.info('[DynamicAuditorManager - startDynamicAudit] auditRunId: ', auditRunId);

        // Start audits in a worker thread to prevent blocking the main thread
        const workerConfig = {
            applicationId,
            auditRunId,
        };

        // start Lighthouse analysis
        await forkWorker(
            './src/workers/LighthouseAnalysisWorker.ts',
            workerConfig as WorkerOptions,
        );
        AppLogger.info(
            '[DynamicAuditorManager - startDynamicAudit] Lighthouse Audit have completed successfully.',
        );

        // start Green Hosting analysis
        await forkWorker(
            './src/workers/GreenHostingAnalysisWorker.ts',
            workerConfig as WorkerOptions,
        );
        AppLogger.info(
            '[DynamicAuditorManager - startDynamicAudit] Green Hosting Audit have completed successfully.',
        );

        // start SonarQube analysis
        await forkWorker('./src/workers/SonarQubeAnalysisWorker.ts', workerConfig as WorkerOptions);
        AppLogger.info(
            '[DynamicAuditorManager - startDynamicAudit] SonarQube Audit have completed successfully.',
        );

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
