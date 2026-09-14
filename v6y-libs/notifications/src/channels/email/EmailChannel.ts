import { Injectable } from '@nestjs/common';

import { AccountProvider, AppLogger, ApplicationProvider, AuditRunProvider } from '@v6y/core-logic';

import { INotificationChannel, NotificationEvent } from '../INotificationChannel.ts';
import EmailConfig from './EmailConfig.ts';
import EmailMailerService from './EmailMailerService.ts';
import { collectAuditRecipients } from './EmailRecipients.ts';
import EmailTemplates, { AuditScoreBreakdown } from './EmailTemplates.ts';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const buildScoreBreakdown = (audits: Array<{ scoreStatus?: string | null }>): AuditScoreBreakdown =>
    audits.reduce<AuditScoreBreakdown>(
        (acc, audit) => {
            acc.total += 1;

            if (audit.scoreStatus === 'success') {
                acc.success += 1;
            } else if (audit.scoreStatus === 'warning') {
                acc.warning += 1;
            } else if (audit.scoreStatus === 'error') {
                acc.error += 1;
            }

            return acc;
        },
        { total: 0, success: 0, warning: 0, error: 0 },
    );

/**
 * Email channel: delivers audit-run-completed notifications and daily digests
 * via SMTP.  Active only when `V6Y_MAIL_SMTP_HOST` is set and
 * `V6Y_MAIL_ENABLED` is not `'false'`.
 */
@Injectable()
export class EmailChannel implements INotificationChannel {
    readonly channelId = 'email';

    isAvailable(): boolean {
        return EmailConfig.isMailEnabled();
    }

    async notify(event: NotificationEvent): Promise<void> {
        if (event.type === 'audit-run-completed') {
            await this.notifyAuditRunCompleted(event.data.auditRunId);
        } else if (event.type === 'daily-digest') {
            await this.sendDailyDigests();
        }
    }

    private async notifyAuditRunCompleted(auditRunId: number): Promise<void> {
        try {
            const auditRun = await AuditRunProvider.getAuditRunWithAudits(auditRunId);

            if (!auditRun?._id) {
                AppLogger.warn(
                    `[EmailChannel] Audit run ${auditRunId} not found, no notification sent.`,
                );
                return;
            }

            const [owner, application] = await Promise.all([
                ApplicationProvider.getApplicationOwner({ _id: auditRun.appId }),
                ApplicationProvider.getApplicationDetailsInfoByParams({ _id: auditRun.appId }),
            ]);

            const recipients = collectAuditRecipients(owner, application?.contactMail);

            if (!recipients.length) {
                AppLogger.info(
                    `[EmailChannel] applicationId=${auditRun.appId} has no reachable recipient, no notification sent.`,
                );
                return;
            }

            const { subject, text, html } = EmailTemplates.buildAuditRunCompletedEmail({
                username: owner?.username || 'there',
                applicationId: auditRun.appId,
                applicationName: application?.name || `Application #${auditRun.appId}`,
                auditRunId: auditRun._id,
                runStatus: auditRun.runStatus,
                branch: auditRun.branch,
                errorMessage: auditRun.errorMessage,
                scores: buildScoreBreakdown(auditRun.audits),
            });

            await EmailMailerService.sendMail({ to: recipients, subject, text, html });
        } catch (error) {
            AppLogger.error(
                `[EmailChannel] Unable to notify completion of audit run ${auditRunId}: `,
                error,
            );
        }
    }

    private async sendDailyDigests(): Promise<void> {
        const recipients = await AccountProvider.getDailyDigestRecipients();

        if (!recipients) {
            AppLogger.error(
                '[EmailChannel] Unable to read daily digest recipients, digest aborted.',
            );
            return;
        }

        const since = new Date(Date.now() - DAY_IN_MS);
        let sentCount = 0;

        for (const recipient of recipients) {
            try {
                if (!recipient.email?.length) {
                    continue;
                }

                const applicationIds = recipient.applications.map((a) => a._id);
                const auditRuns = await AuditRunProvider.getAuditRunsForApplicationsSince(
                    applicationIds,
                    since,
                );

                if (!auditRuns.length) {
                    continue;
                }

                const applications = recipient.applications
                    .map((application) => {
                        const appRuns = auditRuns.filter((run) => run.appId === application._id);

                        return {
                            applicationId: application._id,
                            applicationName: application.name,
                            runCount: appRuns.length,
                            completedCount: appRuns.filter((r) => r.runStatus === 'completed')
                                .length,
                            failedCount: appRuns.filter((r) =>
                                ['failed', 'error'].includes(r.runStatus),
                            ).length,
                            scores: buildScoreBreakdown(appRuns.flatMap((r) => r.audits)),
                        };
                    })
                    .filter((a) => a.runCount > 0);

                if (!applications.length) {
                    continue;
                }

                const { subject, text, html } = EmailTemplates.buildDailyDigestEmail({
                    username: recipient.username,
                    date: new Date(),
                    applications,
                });

                if (
                    await EmailMailerService.sendMail({ to: recipient.email, subject, text, html })
                ) {
                    sentCount += 1;
                }
            } catch (error) {
                AppLogger.error(
                    `[EmailChannel] Unable to build digest for accountId=${recipient._id}: `,
                    error,
                );
            }
        }

        AppLogger.info(`[EmailChannel] Sent ${sentCount} daily digest(s).`);
    }
}
