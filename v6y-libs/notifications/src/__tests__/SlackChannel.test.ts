import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const getAuditRunWithAudits = vi.fn();
const getAuditRunsForApplicationsSince = vi.fn();
const getApplicationOwner = vi.fn();
const getApplicationDetailsInfoByParams = vi.fn();
const getApplicationsWithSlackChannel = vi.fn();
const getDailyDigestRecipients = vi.fn();
const sendMessage = vi.fn();

vi.mock('@v6y/core-logic', () => ({
    AppLogger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
    AccountProvider: { getDailyDigestRecipients },
    ApplicationProvider: {
        getApplicationOwner,
        getApplicationDetailsInfoByParams,
        getApplicationsWithSlackChannel,
    },
    AuditRunProvider: { getAuditRunWithAudits, getAuditRunsForApplicationsSince },
}));

vi.mock('../channels/slack/SlackClient.ts', () => ({
    default: { sendMessage },
}));

const { SlackChannel } = await import('../channels/slack/SlackChannel.ts');

describe('SlackChannel', () => {
    let channel: InstanceType<typeof SlackChannel>;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.V6Y_SLACK_BOT_TOKEN = 'xoxb-test-token';
        sendMessage.mockResolvedValue(true);
        getAuditRunsForApplicationsSince.mockResolvedValue([]);
        getApplicationsWithSlackChannel.mockResolvedValue([]);
        getDailyDigestRecipients.mockResolvedValue([]);
        channel = new SlackChannel();
    });

    afterEach(() => {
        delete process.env.V6Y_SLACK_BOT_TOKEN;
    });

    describe('isAvailable()', () => {
        it('returns true when the bot token is configured', () => {
            expect(channel.isAvailable()).toBe(true);
        });

        it('returns false when the bot token is absent', () => {
            delete process.env.V6Y_SLACK_BOT_TOKEN;
            expect(channel.isAvailable()).toBe(false);
        });
    });

    describe('notify — audit-run-completed', () => {
        beforeEach(() => {
            getAuditRunWithAudits.mockResolvedValue({
                _id: 42,
                appId: 7,
                runStatus: 'completed',
                errorMessage: null,
            });
        });

        it('DMs the application owner when slackUserId is set', async () => {
            getApplicationOwner.mockResolvedValue({
                _id: 3,
                slackUserId: 'U0123',
                slackNotificationsEnabled: true,
            });
            getApplicationDetailsInfoByParams.mockResolvedValue({ _id: 7, name: 'Checkout' });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });

            expect(sendMessage).toHaveBeenCalledWith('U0123', expect.stringContaining('Checkout'));
        });

        it('also posts to the application Slack channel when configured', async () => {
            getApplicationOwner.mockResolvedValue({ _id: 3, slackUserId: null });
            getApplicationDetailsInfoByParams.mockResolvedValue({
                _id: 7,
                name: 'Checkout',
                slackChannelId: 'C0999',
                slackChannelNotificationsEnabled: true,
            });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });

            expect(sendMessage).toHaveBeenCalledWith('C0999', expect.any(String));
        });

        it('skips silently when neither a Slack user nor a Slack channel is configured', async () => {
            getApplicationOwner.mockResolvedValue({ _id: 3, slackUserId: null });
            getApplicationDetailsInfoByParams.mockResolvedValue({ _id: 7, name: 'Checkout' });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });

            expect(sendMessage).not.toHaveBeenCalled();
        });

        it('does nothing when the audit run cannot be found', async () => {
            getAuditRunWithAudits.mockResolvedValue(null);

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 999 } });

            expect(sendMessage).not.toHaveBeenCalled();
        });
    });

    describe('notify — daily-digest', () => {
        it('DMs every account digest recipient that has a slackUserId', async () => {
            getDailyDigestRecipients.mockResolvedValue([
                {
                    _id: 1,
                    slackUserId: 'U0111',
                    slackNotificationsEnabled: true,
                    applications: [{ _id: 7, name: 'Checkout', acronym: 'CHK' }],
                },
                {
                    _id: 2,
                    slackUserId: null,
                    slackNotificationsEnabled: false,
                    applications: [{ _id: 8, name: 'Billing', acronym: 'BIL' }],
                },
            ]);
            getAuditRunsForApplicationsSince.mockResolvedValue([
                { _id: 100, appId: 7, runStatus: 'completed' },
            ]);

            await channel.notify({ type: 'daily-digest', data: {} });

            expect(sendMessage).toHaveBeenCalledWith('U0111', expect.stringContaining('Checkout'));
            expect(sendMessage).toHaveBeenCalledTimes(1);
        });

        it('skips a recipient that has a slackUserId but disabled notifications', async () => {
            getDailyDigestRecipients.mockResolvedValue([
                {
                    _id: 1,
                    slackUserId: 'U0111',
                    slackNotificationsEnabled: false,
                    applications: [{ _id: 7, name: 'Checkout', acronym: 'CHK' }],
                },
            ]);
            getAuditRunsForApplicationsSince.mockResolvedValue([
                { _id: 100, appId: 7, runStatus: 'completed' },
            ]);

            await channel.notify({ type: 'daily-digest', data: {} });

            expect(sendMessage).not.toHaveBeenCalled();
        });

        it('posts a digest to every application with a configured Slack channel', async () => {
            getApplicationsWithSlackChannel.mockResolvedValue([
                { _id: 7, name: 'Checkout', acronym: 'CHK', slackChannelId: 'C0999' },
            ]);
            getAuditRunsForApplicationsSince.mockResolvedValue([
                { _id: 100, appId: 7, runStatus: 'completed' },
            ]);

            await channel.notify({ type: 'daily-digest', data: {} });

            expect(sendMessage).toHaveBeenCalledWith('C0999', expect.stringContaining('Checkout'));
        });
    });
});
