import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import DynamicAuditorManager from '../auditors/DynamicAuditorManager.ts';
import { AuditOutcome } from '../auditors/types/AuditCommonsType.ts';
import { DYNAMIC_ANALYSIS_JOB, DYNAMIC_ANALYSIS_QUEUE } from './DynamicAnalysisQueue.ts';

/**
 * The heavy work still runs in worker threads, forked by the manager: a BullMQ
 * processor executes in the service's own process, so running the analysis inline
 * would block its event loop. The queue owns scheduling, persistence and
 * observability; the worker threads keep the CPU work off the main thread.
 */
@Processor(DYNAMIC_ANALYSIS_QUEUE)
export class DynamicAnalysisProcessor extends WorkerHost {
    async process(
        job: Job<{ applicationId?: number; auditRunId?: string }, unknown, string>,
    ): Promise<AuditOutcome> {
        AppLogger.info(`[DynamicAnalysisProcessor] Processing job ${job.id} (${job.name})`);

        if (job.name !== DYNAMIC_ANALYSIS_JOB) {
            throw new Error(`Unsupported dynamic analysis job: ${job.name}`);
        }

        return DynamicAuditorManager.startDynamicAudit(job.data || {});
    }
}
