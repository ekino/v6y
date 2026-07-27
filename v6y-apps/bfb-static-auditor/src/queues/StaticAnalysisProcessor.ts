import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { AppLogger } from '@v6y/core-logic';

import StaticAuditorManager from '../auditors/StaticAuditorManager.ts';
import { AuditOutcome } from '../auditors/types/AuditCommonsType.ts';
import { STATIC_ANALYSIS_JOB, STATIC_ANALYSIS_QUEUE } from './StaticAnalysisQueue.ts';

/**
 * The heavy work still runs in worker threads, forked by the manager: a BullMQ
 * processor executes in the service's own process, so running the analysis inline
 * would block its event loop. The queue owns scheduling, persistence and
 * observability; the worker threads keep the CPU work off the main thread.
 */
@Processor(STATIC_ANALYSIS_QUEUE)
export class StaticAnalysisProcessor extends WorkerHost {
    async process(
        job: Job<
            { applicationId?: number; workspaceFolder?: string; auditRunId?: string },
            unknown,
            string
        >,
    ): Promise<AuditOutcome> {
        AppLogger.info(`[StaticAnalysisProcessor] Processing job ${job.id} (${job.name})`);

        if (job.name !== STATIC_ANALYSIS_JOB) {
            throw new Error(`Unsupported static code analysis job: ${job.name}`);
        }

        return StaticAuditorManager.startStaticAudit(job.data || {});
    }
}
