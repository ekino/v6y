import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleDestroy, Optional } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';

import { AppLogger, QueueConfig } from '@v6y/core-logic';

import { AuditCommonsType, AuditOutcome } from '../auditors/types/AuditCommonsType.ts';
import { DYNAMIC_ANALYSIS_JOB, DYNAMIC_ANALYSIS_QUEUE } from './DynamicAnalysisQueue.ts';

@Injectable()
export class DynamicAnalysisQueueService implements OnModuleDestroy {
    private queueEvents?: QueueEvents;

    constructor(
        @Optional()
        @InjectQueue(DYNAMIC_ANALYSIS_QUEUE)
        private readonly dynamicAnalysisQueue?: Queue,
    ) {}

    async onModuleDestroy() {
        await this.queueEvents?.close();
    }

    /**
     * QueueEvents needs its own blocking Redis connection, so it is created on first
     * use and closed with the module rather than kept open for services that never
     * run an audit.
     */
    private resolveQueueEvents() {
        if (!this.queueEvents) {
            this.queueEvents = new QueueEvents(DYNAMIC_ANALYSIS_QUEUE, {
                connection: QueueConfig.buildQueueConnection(),
                prefix: QueueConfig.buildQueuePrefix(),
            });
        }

        return this.queueEvents;
    }

    /**
     * Runs the dynamic analysis through the queue and waits for its outcome, so
     * the caller (the main analyzer) keeps the synchronous contract it relies on to
     * decide whether the audit run succeeded.
     *
     * Returns null when the queue is unavailable, which the controller turns into a
     * failure instead of a misleading success.
     */
    async runDynamicAnalysis({
        applicationId,
        auditRunId,
    }: AuditCommonsType): Promise<AuditOutcome | null> {
        if (!this.dynamicAnalysisQueue) {
            AppLogger.warn(
                '[DynamicAnalysisQueueService] Queue unavailable, dynamic analysis skipped.',
            );
            return null;
        }

        AppLogger.info(
            `[DynamicAnalysisQueueService] Enqueuing dynamic analysis for applicationId=${applicationId}`,
        );

        // Subscribed before enqueuing: a short job could otherwise finish before the
        // listener exists, and waitUntilFinished would then have to fall back to
        // reading a job that retention may already have dropped.
        const queueEvents = this.resolveQueueEvents();
        await queueEvents.waitUntilReady();

        const job = await this.dynamicAnalysisQueue.add(
            DYNAMIC_ANALYSIS_JOB,
            { applicationId, auditRunId },
            {
                // No fixed jobId: a deterministic id would make BullMQ silently return
                // an already-settled job instead of running a new analysis.
                // The caller blocks on this job and owns the retry decision, so
                // retrying here would only stretch the request it is waiting on.
                attempts: 1,
                // Bounded retention rather than removeOnComplete: true — the caller reads
                // this job's return value, which an immediate removal can race away.
                removeOnComplete: { count: 20 },
                removeOnFail: { count: 20 },
            },
        );

        return (await job.waitUntilFinished(queueEvents)) as AuditOutcome;
    }
}
