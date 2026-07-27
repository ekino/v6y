import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import DevOpsAuditorManager from '../auditors/DevOpsAuditorManager.ts';
import { AuditOutcome } from '../auditors/types/AuditCommonsType.ts';
import { DEVOPS_ANALYSIS_JOB, DEVOPS_ANALYSIS_QUEUE } from './DevOpsAnalysisQueue.ts';

/**
 * The heavy work still runs in a worker thread, forked by the manager: a BullMQ
 * processor executes in the service's own process, so running the analysis inline
 * would block its event loop. The queue owns scheduling, persistence and
 * observability; the worker thread keeps the CPU work off the main thread.
 */
@Processor(DEVOPS_ANALYSIS_QUEUE)
export class DevOpsAnalysisProcessor extends WorkerHost {
    async process(
        job: Job<{ applicationId?: number; auditRunId?: string }, unknown, string>,
    ): Promise<AuditOutcome> {
        AppLogger.info(`[DevOpsAnalysisProcessor] Processing job ${job.id} (${job.name})`);

        if (job.name !== DEVOPS_ANALYSIS_JOB) {
            throw new Error(`Unsupported DevOps analysis job: ${job.name}`);
        }

        const { applicationId, auditRunId } = job.data || {};

        if (!applicationId) {
            throw new Error('The applicationId is required to process a DevOps analysis');
        }

        return DevOpsAuditorManager.startDevOpsAudit({ applicationId, auditRunId });
    }
}
