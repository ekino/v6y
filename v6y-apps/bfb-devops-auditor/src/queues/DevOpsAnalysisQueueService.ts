import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleDestroy, Optional } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';

import { AppLogger, QueueConfig } from '@v6y/core-logic';

import { AuditCommonsType, AuditOutcome } from '../auditors/types/AuditCommonsType.ts';
import { DEVOPS_ANALYSIS_JOB, DEVOPS_ANALYSIS_QUEUE } from './DevOpsAnalysisQueue.ts';

@Injectable()
export class DevOpsAnalysisQueueService implements OnModuleDestroy {
    private queueEvents?: QueueEvents;

    constructor(
        @Optional()
        @InjectQueue(DEVOPS_ANALYSIS_QUEUE)
        private readonly devOpsAnalysisQueue?: Queue,
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
            this.queueEvents = new QueueEvents(DEVOPS_ANALYSIS_QUEUE, {
                connection: QueueConfig.buildQueueConnection(),
                prefix: QueueConfig.buildQueuePrefix(),
            });
        }

        return this.queueEvents;
    }

    /**
     * Runs the DevOps analysis through the queue and waits for its outcome, so the
     * caller (the main analyzer) keeps the synchronous contract it relies on to
     * decide whether the audit run succeeded.
     *
     * Returns null when the queue is unavailable, which the controller turns into a
     * failure instead of a misleading success.
     */
    async runDevOpsAnalysis({
        applicationId,
        auditRunId,
    }: AuditCommonsType): Promise<AuditOutcome | null> {
        if (!this.devOpsAnalysisQueue) {
            AppLogger.warn(
                '[DevOpsAnalysisQueueService] Queue unavailable, DevOps analysis skipped.',
            );
            return null;
        }

        AppLogger.info(
            `[DevOpsAnalysisQueueService] Enqueuing DevOps analysis for applicationId=${applicationId}`,
        );

        // Subscribed before enqueuing: a short job could otherwise finish before the
        // listener exists, and waitUntilFinished would then have to fall back to
        // reading a job that retention may already have dropped.
        const queueEvents = this.resolveQueueEvents();
        await queueEvents.waitUntilReady();

        const job = await this.devOpsAnalysisQueue.add(
            DEVOPS_ANALYSIS_JOB,
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
