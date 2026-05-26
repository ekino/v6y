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
        try {
            await forkWorker(
                './src/workers/LighthouseAnalysisWorker.ts',
                workerConfig as WorkerOptions,
            );
            AppLogger.info(
                '[DynamicAuditorManager - startDynamicAudit] Lighthouse Audit have completed successfully.',
            );
        } catch (lighthouseError) {
            AppLogger.error(
                '[DynamicAuditorManager - startDynamicAudit] Lighthouse worker error:',
                lighthouseError,
            );
        }

        // start Green Hosting analysis
        try {
            await forkWorker(
                './src/workers/GreenHostingAnalysisWorker.ts',
                workerConfig as WorkerOptions,
            );
            AppLogger.info(
                '[DynamicAuditorManager - startDynamicAudit] Green Hosting Audit have completed successfully.',
            );
        } catch (greenError) {
            AppLogger.error(
                '[DynamicAuditorManager - startDynamicAudit] Green Hosting worker error:',
                greenError,
            );
        }

        // start SonarQube analysis
        try {
            await forkWorker(
                './src/workers/SonarQubeAnalysisWorker.ts',
                workerConfig as WorkerOptions,
            );
            AppLogger.info(
                '[DynamicAuditorManager - startDynamicAudit] SonarQube Audit have completed successfully.',
            );
        } catch (sonarError) {
            AppLogger.error(
                '[DynamicAuditorManager - startDynamicAudit] SonarQube worker error:',
                sonarError,
            );
        }

        return true; // Indicates successful initiation of audits
    } catch (error) {
        AppLogger.error(
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
