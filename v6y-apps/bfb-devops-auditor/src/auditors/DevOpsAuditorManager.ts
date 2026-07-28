/**
 * Starts the DevOps audit process for a given application.
 * @param {AuditCommonsType} - The ID of the application to audit
 */
import { AppLogger, WorkerHelper } from '@v6y/core-logic';

import { AuditCommonsType, AuditOutcome, AuditOutcomeStatus } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;

type DevOpsWorkerResult =
    | string
    | {
          status?: AuditOutcomeStatus;
          message?: string;
      };

/**
 * Starts the DevOps audit process for a given application
 * @param applicationId
 * @param auditRunId
 */
const startDevOpsAudit = async ({
    applicationId,
    auditRunId,
}: AuditCommonsType): Promise<AuditOutcome> => {
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

        if (typeof workerResult === 'string') {
            // Legacy string payload: only its wording tells success from failure.
            return /failed|error/i.test(workerResult)
                ? { status: 'failed', message: workerResult }
                : { status: 'success', message: workerResult };
        }

        const status = workerResult?.status ?? 'failed';

        if (status === 'failed') {
            AppLogger.error(
                '[DevOpsAuditorManager - startDevOpsAudit] DevOps Audit worker reported failure.',
                workerResult,
            );
            return { status: 'failed', message: workerResult?.message };
        }

        if (status === 'skipped') {
            AppLogger.warn(
                `[DevOpsAuditorManager - startDevOpsAudit] DevOps Audit skipped: ${workerResult?.message}`,
            );
            return { status: 'skipped', message: workerResult?.message };
        }

        AppLogger.info(
            '[DevOpsAuditorManager - startDevOpsAudit] DevOps Audit have completed successfully.',
        );

        return { status: 'success', message: workerResult?.message };
    } catch (error) {
        AppLogger.error(
            '[DevOpsAuditorManager - startDevOpsAudit] An exception occurred during the app audits: ',
            error,
        );
        return { status: 'failed', message: String(error) };
    }
};

const DevOpsAuditorManager = {
    startDevOpsAudit,
};

export default DevOpsAuditorManager;
