import CronJob, { validate as validateCronExpression } from 'node-cron';

import { AppLogger, ApplicationProvider } from '@v6y/core-logic';

import { isAuditCronRateAcceptable } from '../config/AuditCronPolicy.ts';
import { APPLICATION_ANALYSIS_SCHEDULE } from '../queues/ApplicationAnalysisQueue.ts';
import { ApplicationAnalysisQueueService } from '../queues/ApplicationAnalysisQueueService.ts';

/**
 * Bring the BullMQ job schedulers back in line with the database.
 *
 * The database owns the audit reporting frequency; the job schedulers that act on
 * it live in Redis. The two can diverge in both directions:
 *  - Redis loses the schedulers (no persistence guarantee, image bump, flush)
 *    while the applications are still flagged as scheduled, so audits silently
 *    stop forever;
 *  - a scheduler survives an application that no longer schedules audits (a
 *    schedule removal that failed, a row deleted while the analyzer was down),
 *    so it keeps enqueuing analyses for nothing.
 *
 * Re-upserting is idempotent, so this doubles as the retry path for a schedule
 * write the BFF could not apply when the application was saved.
 */
const reconcile = async (applicationAnalysisQueueService: ApplicationAnalysisQueueService) => {
    const scheduledApplications = await ApplicationProvider.getScheduledApplicationList();

    if (!scheduledApplications) {
        AppLogger.error(
            '[ApplicationScheduleReconciler] Unable to read the scheduled applications, reconciliation skipped.',
        );
        return;
    }

    const expectedSchedulerIds = new Set<string>();

    for (const { _id, auditFrequencyCron } of scheduledApplications) {
        if (
            !validateCronExpression(auditFrequencyCron) ||
            !isAuditCronRateAcceptable(auditFrequencyCron)
        ) {
            AppLogger.error(
                `[ApplicationScheduleReconciler] applicationId=${_id} has an invalid or too frequent cron (${auditFrequencyCron}), its schedule was not installed.`,
            );
            continue;
        }

        expectedSchedulerIds.add(`${APPLICATION_ANALYSIS_SCHEDULE}-${_id}`);

        try {
            await applicationAnalysisQueueService.upsertApplicationSchedule(
                _id,
                auditFrequencyCron,
            );
        } catch (error) {
            AppLogger.error(
                `[ApplicationScheduleReconciler] Failed to re-apply the schedule of applicationId=${_id}: `,
                error,
            );
        }
    }

    const registeredSchedulerIds =
        await applicationAnalysisQueueService.listApplicationScheduleIds();

    for (const schedulerId of registeredSchedulerIds) {
        if (expectedSchedulerIds.has(schedulerId)) {
            continue;
        }

        const applicationId = parseInt(
            schedulerId.slice(`${APPLICATION_ANALYSIS_SCHEDULE}-`.length),
            10,
        );

        if (Number.isNaN(applicationId)) {
            continue;
        }

        AppLogger.info(
            `[ApplicationScheduleReconciler] Removing the orphaned schedule of applicationId=${applicationId}`,
        );

        try {
            await applicationAnalysisQueueService.removeApplicationSchedule(applicationId);
        } catch (error) {
            AppLogger.error(
                `[ApplicationScheduleReconciler] Failed to remove the orphaned schedule of applicationId=${applicationId}: `,
                error,
            );
        }
    }

    AppLogger.info(
        `[ApplicationScheduleReconciler] Reconciled ${expectedSchedulerIds.size} application schedule(s).`,
    );
};

const runReconciliation = async (
    applicationAnalysisQueueService: ApplicationAnalysisQueueService,
) => {
    try {
        await reconcile(applicationAnalysisQueueService);
    } catch (error) {
        AppLogger.error('[ApplicationScheduleReconciler] Reconciliation failed: ', error);
    }
};

/**
 * Reconciled at startup, then every night. The nightly pass is offset from the
 * midnight catalog refresh so the two do not compete for the queue.
 */
const start = (applicationAnalysisQueueService: ApplicationAnalysisQueueService) => {
    AppLogger.info('******************** Reconciling the audit schedules **********************');
    setTimeout(() => {
        void runReconciliation(applicationAnalysisQueueService);
    }, 2000);

    const job = CronJob.schedule('00 30 03 * * *', () => {
        AppLogger.info(
            '******************** Reconciling the audit schedules (scheduled) **********************',
        );
        void runReconciliation(applicationAnalysisQueueService);
    });
    job.start();
};

const ApplicationScheduleReconciler = {
    start,
    reconcile,
};

export default ApplicationScheduleReconciler;
