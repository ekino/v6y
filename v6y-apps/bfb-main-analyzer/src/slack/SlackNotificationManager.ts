import { AccountProvider, AppLogger, ApplicationProvider, AuditRunProvider } from '@v6y/core-logic';

import SlackService from './SlackService.ts';

/**
 * Notify all owners of an application that an audit has completed.
 *
 * An "owner" is any account whose `applications` array contains the app's id.
 * The DM is only sent when the account has a `slackUserId` set.
 */
const notifyAuditComplete = async (
    applicationId: number,
    auditRunId: number | undefined,
    success: boolean,
): Promise<void> => {
    try {
        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        if (!application?._id) {
            AppLogger.info(
                `[SlackNotificationManager] application ${applicationId} not found, skipping`,
            );
            return;
        }

        const owners = await AccountProvider.getAccountsByApplicationId(applicationId);

        const emoji = success ? '✅' : '❌';
        const status = success ? 'finished successfully' : 'failed';
        const runSuffix = auditRunId ? ` (run #${auditRunId})` : '';
        const text = `${emoji} Vitality audit for *${application.name}*${runSuffix} ${status}.`;

        await Promise.all(
            owners
                .filter((owner) => !!owner.slackUserId)
                .map((owner) => SlackService.sendDm(owner.slackUserId as string, text)),
        );
    } catch (error) {
        AppLogger.error('[SlackNotificationManager] notifyAuditComplete error:', error);
    }
};

/** Notify all owners of one application with a digest message. */
const notifyDigestForApp = async (
    appId: number,
    runs: { id: number; runStatus: string }[],
): Promise<void> => {
    const application = await ApplicationProvider.getApplicationDetailsInfoByParams({ _id: appId });
    if (!application?.name) return;

    const owners = await AccountProvider.getAccountsByApplicationId(appId);
    const lines = runs.map((r) => {
        const emoji = r.runStatus === 'success' || r.runStatus === 'completed' ? '✅' : '❌';
        return `  ${emoji} ${r.runStatus} (run #${r.id})`;
    });
    const message = `📋 *Daily Vitality digest for ${application.name}*\n${lines.join('\n')}`;

    await Promise.all(
        owners
            .filter((owner) => !!owner.slackUserId)
            .map((owner) => SlackService.sendDm(owner.slackUserId as string, message)),
    );
};

/**
 * Send a daily digest DM to each account summarising audit activity for the
 * past 24 hours across the applications they own.
 */
const sendDailyDigest = async (): Promise<void> => {
    try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentRuns = await AuditRunProvider.getAllAuditRuns(
            undefined,
            undefined,
            since.toISOString(),
        );

        if (!recentRuns?.length) {
            AppLogger.info('[SlackNotificationManager] No recent audit runs — skipping digest.');
            return;
        }

        const runsByApp = new Map<number, typeof recentRuns>();
        for (const run of recentRuns) {
            const list = runsByApp.get(run.appId) ?? [];
            list.push(run);
            runsByApp.set(run.appId, list);
        }

        await Promise.all(
            Array.from(runsByApp.entries()).map(([appId, runs]) => notifyDigestForApp(appId, runs)),
        );
    } catch (error) {
        AppLogger.error('[SlackNotificationManager] sendDailyDigest error:', error);
    }
};

const SlackNotificationManager = { notifyAuditComplete, sendDailyDigest };

export default SlackNotificationManager;
