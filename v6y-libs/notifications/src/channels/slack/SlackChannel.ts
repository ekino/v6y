import { Injectable } from '@nestjs/common';

import { AppLogger, ApplicationProvider, AuditRunProvider } from '@v6y/core-logic';

import { INotificationChannel, NotificationEvent } from '../INotificationChannel.ts';
import SlackClient from './SlackClient.ts';
import SlackConfig from './SlackConfig.ts';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const buildReportLink = (applicationId: number, auditRunId?: number): string => {
    const baseUrl = SlackConfig.getPublicAppUrl();

    if (!baseUrl.length) {
        return '';
    }

    return auditRunId
        ? `${baseUrl}/applications/show/${applicationId}?auditRunId=${auditRunId}`
        : `${baseUrl}/applications/show/${applicationId}`;
};

const buildAuditRunCompletedMessage = ({
    applicationName,
    applicationId,
    auditRunId,
    runStatus,
    errorMessage,
}: {
    applicationName: string;
    applicationId: number;
    auditRunId: number;
    runStatus?: string | null;
    errorMessage?: string | null;
}): string => {
    const succeeded = runStatus === 'completed';
    const status = succeeded ? 'finished successfully' : `finished with status "${runStatus}"`;
    const link = buildReportLink(applicationId, auditRunId);

    const lines = [
        `*Vitality audit — ${applicationName}* (run #${auditRunId})`,
        '',
        `${status.charAt(0).toUpperCase()}${status.slice(1)}.`,
        !succeeded && errorMessage ? `Error: ${errorMessage}` : undefined,
        link ? `<${link}|View report>` : undefined,
    ].filter((line): line is string => line !== undefined);

    return lines.join('\n');
};

/**
 * Delivers a channel-scoped daily digest: for a single application, one line
 * per audit run recorded since `since`, most recent first.
 */
const buildChannelDigestMessage = (
    applicationName: string,
    applicationId: number,
    auditRuns: Array<{ _id: number; runStatus: string }>,
): string => {
    const lines = auditRuns.map((run) => {
        const link = buildReportLink(applicationId, run._id);
        const label = `run #${run._id}: ${run.runStatus}`;
        return `• ${link ? `<${link}|${label}>` : label}`;
    });

    return [`Daily Vitality digest — *${applicationName}*`, '', ...lines].join('\n');
};

/**
 * Slack channel: delivers audit-run-completed notifications and daily digests
 * via the Slack Bot API. Active only when `V6Y_SLACK_BOT_TOKEN` is set.
 *
 * Delivery is channel-scoped and best-effort: a post to the application's Slack
 * channel when the application has `slackChannelId` set and channel
 * notifications enabled — this lets a whole team follow a project without every
 * member configuring a personal Slack id.
 */
@Injectable()
export class SlackChannel implements INotificationChannel {
    readonly channelId = 'slack';

    isAvailable(): boolean {
        return SlackConfig.isSlackEnabled();
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
                    `[SlackChannel] Audit run ${auditRunId} not found, no notification sent.`,
                );
                return;
            }

            const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
                _id: auditRun.appId,
            });

            if (
                !application?.slackChannelNotificationsEnabled ||
                !application.slackChannelId?.length
            ) {
                AppLogger.info(
                    `[SlackChannel] applicationId=${auditRun.appId} has no Slack channel configured, no notification sent.`,
                );
                return;
            }

            const applicationName = application.name || `Application #${auditRun.appId}`;
            const message = buildAuditRunCompletedMessage({
                applicationName,
                applicationId: auditRun.appId,
                auditRunId: auditRun._id,
                runStatus: auditRun.runStatus,
                errorMessage: auditRun.errorMessage,
            });

            await SlackClient.sendMessage(application.slackChannelId, message);
        } catch (error) {
            AppLogger.error(
                `[SlackChannel] Unable to notify completion of audit run ${auditRunId}: `,
                error,
            );
        }
    }

    private async sendDailyDigests(): Promise<void> {
        const since = new Date(Date.now() - DAY_IN_MS);

        await this.sendChannelDigests(since);
    }

    private async sendChannelDigests(since: Date): Promise<void> {
        const applications = await ApplicationProvider.getApplicationsWithSlackChannel();

        if (!applications.length) {
            return;
        }

        const auditRuns = await AuditRunProvider.getAuditRunsForApplicationsSince(
            applications.map((application) => application._id),
            since,
        );

        let sentCount = 0;

        for (const application of applications) {
            try {
                const appRuns = auditRuns
                    .filter((run) => run.appId === application._id)
                    .sort((a, b) => b._id - a._id);

                if (!appRuns.length) {
                    continue;
                }

                const message = buildChannelDigestMessage(
                    application.name,
                    application._id,
                    appRuns,
                );

                if (await SlackClient.sendMessage(application.slackChannelId, message)) {
                    sentCount += 1;
                }
            } catch (error) {
                AppLogger.error(
                    `[SlackChannel] Unable to build channel digest for applicationId=${application._id}: `,
                    error,
                );
            }
        }

        AppLogger.info(`[SlackChannel] Sent ${sentCount} channel daily digest(s).`);
    }
}
