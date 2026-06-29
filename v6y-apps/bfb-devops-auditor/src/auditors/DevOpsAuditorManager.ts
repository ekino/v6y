/**
 * Starts the DevOps audit process for a given application.
 * @param {AuditCommonsType} - The ID of the application to audit
 */
import { AppLogger, WorkerHelper } from '@v6y/core-logic';

import { AuditCommonsType } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;

type DevOpsWorkerResult =
    | string
    | {
          status?: 'success' | 'failed';
          message?: string;
      };

/**
 * Starts the DevOps audit process for a given application
 * @param applicationId
 * @param auditRunId
 */
const startDevOpsAudit = async ({ applicationId, auditRunId }: AuditCommonsType) => {
    try {
        AppLogger.info('[DevOpsAuditorManager - startDevOpsAudit] applicationId: ', applicationId);
        AppLogger.info('[DevOpsAuditorManager - startDevOpsAudit] auditRunId: ', auditRunId);

        // Start audits in a worker thread to prevent blocking the main thread
        const workerConfig = {
            applicationId,
            auditRunId,
        };

        const workerResult = (await forkWorker(
            './src/workers/DevOpsAnalysisWorker.ts',
            workerConfig,
        )) as DevOpsWorkerResult;

        const isWorkerFailure =
            (typeof workerResult === 'object' && workerResult?.status === 'failed') ||
            (typeof workerResult === 'string' && /failed|error/i.test(workerResult));

        if (isWorkerFailure) {
            AppLogger.error(
                '[DevOpsAuditorManager - startDevOpsAudit] DevOps Audit worker reported failure.',
                workerResult,
            );
            return false;
        }

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
