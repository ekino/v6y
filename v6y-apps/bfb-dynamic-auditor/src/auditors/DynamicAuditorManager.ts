import { AppLogger, WorkerHelper } from '@v6y/core-logic';

import ServerConfig from '../commons/ServerConfig.ts';
import { AuditCommonsType, AuditOutcome } from './types/AuditCommonsType.ts';

const { forkWorker } = WorkerHelper;
const { currentConfig } = ServerConfig;

const DYNAMIC_AUDITS = [
    { name: 'Lighthouse', worker: './src/workers/LighthouseAnalysisWorker.ts' },
    { name: 'Green Hosting', worker: './src/workers/GreenHostingAnalysisWorker.ts' },
    { name: 'SonarQube', worker: './src/workers/SonarQubeAnalysisWorker.ts' },
];

const startDynamicAudit = async ({
    applicationId,
    auditRunId,
}: AuditCommonsType): Promise<AuditOutcome> => {
    try {
        AppLogger.info(
            '[DynamicAuditorManager - startDynamicAudit] applicationId: ',
            applicationId,
        );
        AppLogger.info('[DynamicAuditorManager - startDynamicAudit] auditRunId: ', auditRunId);

        // Start audits in a worker thread to prevent blocking the main thread
        const workerConfig = {
            chromeExecutablePath: currentConfig?.chromeExecutablePath,
            applicationId,
            auditRunId,
        };

        // One auditor being unavailable must not discard the reports the others
        // produced, so each failure is collected instead of aborting the batch.
        const failures: string[] = [];

        for (const { name, worker } of DYNAMIC_AUDITS) {
            try {
                await forkWorker(worker, workerConfig as WorkerOptions);
                AppLogger.info(
                    `[DynamicAuditorManager - startDynamicAudit] ${name} Audit have completed successfully.`,
                );
            } catch (auditError) {
                failures.push(name);
                AppLogger.error(
                    `[DynamicAuditorManager - startDynamicAudit] ${name} worker error:`,
                    auditError,
                );
            }
        }

        // Only a total wipeout is a failure: nothing at all was produced, so reporting
        // success would tell the caller an audit ran when none did.
        if (failures.length === DYNAMIC_AUDITS.length) {
            return {
                status: 'failed',
                message: `Every dynamic auditor failed: ${failures.join(', ')}.`,
            };
        }

        return {
            status: 'success',
            message: failures.length
                ? `Dynamic audit completed with failures: ${failures.join(', ')}.`
                : undefined,
        };
    } catch (error) {
        AppLogger.error(
            '[DynamicAuditorManager - startDynamicAudit] An exception occurred during the app audits: ',
            error,
        );
        return { status: 'failed', message: String(error) };
    }
};

const DynamicAuditorManager = {
    startDynamicAudit,
};

export default DynamicAuditorManager;
