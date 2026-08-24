import { AccountProvider, AppLogger, ApplicationProvider, AuditRunProvider } from '@v6y/core-logic';

import MailConfig from '../config/MailConfig.ts';
import EmailTemplates, { AuditScoreBreakdown } from '../mailer/EmailTemplates.ts';
import MailerService from '../mailer/MailerService.ts';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const buildScoreBreakdown = (audits: Array<{ scoreStatus?: string | null }>): AuditScoreBreakdown =>
    audits.reduce<AuditScoreBreakdown>(
        (breakdown, audit) => {
            breakdown.total += 1;

            if (audit.scoreStatus === 'success') {
                breakdown.success += 1;
            } else if (audit.scoreStatus === 'warning') {
                breakdown.warning += 1;
            } else if (audit.scoreStatus === 'error') {
                breakdown.error += 1;
            }

            return breakdown;
        },
        { total: 0, success: 0, warning: 0, error: 0 },
    );

/**
 * Email the owner of an application that one of its audit runs has settled.
 *
 * Always resolves: this runs at the tail of an audit job, and a notification
 * that could not be built or delivered must not mark the audit itself as failed.
 */
const notifyAuditRunCompleted = async (auditRunId: number): Promise<boolean> => {
    try {
        if (!MailConfig.isMailEnabled()) {
            return false;
        }

        const auditRun = await AuditRunProvider.getAuditRunWithAudits(auditRunId);

        if (!auditRun?._id) {
            AppLogger.warn(
                `[AuditNotificationManager] Audit run ${auditRunId} not found, no notification sent.`,
            );
            return false;
        }

        const owner = await ApplicationProvider.getApplicationOwner({ _id: auditRun.appId });

        if (!owner?.email?.length) {
            AppLogger.warn(
                `[AuditNotificationManager] applicationId=${auditRun.appId} has no reachable owner, no notification sent.`,
            );
            return false;
        }

        if (!owner.auditReportEmailsEnabled) {
            AppLogger.info(
                `[AuditNotificationManager] accountId=${owner._id} opted out of the audit report emails.`,
            );
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: auditRun.appId,
        });

        const { subject, text, html } = EmailTemplates.buildAuditRunCompletedEmail({
            username: owner.username,
            applicationId: auditRun.appId,
            applicationName: application?.name || `Application #${auditRun.appId}`,
            auditRunId: auditRun._id,
            runStatus: auditRun.runStatus,
            branch: auditRun.branch,
            errorMessage: auditRun.errorMessage,
            scores: buildScoreBreakdown(auditRun.audits),
        });

        return MailerService.sendMail({ to: owner.email, subject, text, html });
    } catch (error) {
        AppLogger.error(
            `[AuditNotificationManager] Unable to notify the completion of audit run ${auditRunId}: `,
            error,
        );
        return false;
    }
};

/**
 * Email every subscribed owner a recap of the audit runs their applications went
 * through over the last 24 hours. Owners with nothing to report are skipped
 * rather than sent an empty digest.
 *
 * Returns the number of digests actually delivered.
 */
const sendDailyDigests = async (): Promise<number> => {
    if (!MailConfig.isMailEnabled()) {
        AppLogger.info(
            '[AuditNotificationManager] Mail delivery is not configured, digest skipped.',
        );
        return 0;
    }

    const recipients = await AccountProvider.getDailyDigestRecipients();

    if (!recipients) {
        throw new Error(
            '[AuditNotificationManager] Unable to read the daily digest recipients, digest aborted.',
        );
    }

    const since = new Date(Date.now() - DAY_IN_MS);
    let sentCount = 0;

    for (const recipient of recipients) {
        try {
            if (!recipient.email?.length) {
                continue;
            }

            const applicationIds = recipient.applications.map((application) => application._id);
            const auditRuns = await AuditRunProvider.getAuditRunsForApplicationsSince(
                applicationIds,
                since,
            );

            if (!auditRuns.length) {
                continue;
            }

            const applications = recipient.applications
                .map((application) => {
                    const applicationRuns = auditRuns.filter(
                        (run) => run.appId === application._id,
                    );

                    return {
                        applicationId: application._id,
                        applicationName: application.name,
                        runCount: applicationRuns.length,
                        completedCount: applicationRuns.filter(
                            (run) => run.runStatus === 'completed',
                        ).length,
                        failedCount: applicationRuns.filter((run) =>
                            ['failed', 'error'].includes(run.runStatus),
                        ).length,
                        scores: buildScoreBreakdown(applicationRuns.flatMap((run) => run.audits)),
                    };
                })
                .filter((application) => application.runCount > 0);

            if (!applications.length) {
                continue;
            }

            const { subject, text, html } = EmailTemplates.buildDailyDigestEmail({
                username: recipient.username,
                date: new Date(),
                applications,
            });

            if (await MailerService.sendMail({ to: recipient.email, subject, text, html })) {
                sentCount += 1;
            }
        } catch (error) {
            // One unreachable recipient must not cost every other subscriber
            // their digest, so the loop keeps going.
            AppLogger.error(
                `[AuditNotificationManager] Unable to build the digest of accountId=${recipient._id}: `,
                error,
            );
        }
    }

    AppLogger.info(`[AuditNotificationManager] Sent ${sentCount} daily digest(s).`);
    return sentCount;
};

const AuditNotificationManager = {
    notifyAuditRunCompleted,
    sendDailyDigests,
};

export default AuditNotificationManager;
