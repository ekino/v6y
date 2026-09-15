import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const getAuditRunWithAudits = vi.fn();
const getAuditRunsForApplicationsSince = vi.fn();
const getApplicationDetailsInfoByParams = vi.fn();
const getApplicationsWithSlackChannel = vi.fn();
const sendMessage = vi.fn();

vi.mock('@v6y/core-logic', () => ({
    AppLogger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
    ApplicationProvider: {
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

        it('posts to the application Slack channel when configured', async () => {
            getApplicationDetailsInfoByParams.mockResolvedValue({
                _id: 7,
                name: 'Checkout',
                slackChannelId: 'C0999',
                slackChannelNotificationsEnabled: true,
            });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });

            expect(sendMessage).toHaveBeenCalledWith('C0999', expect.stringContaining('Checkout'));
        });

        it('skips silently when no Slack channel is configured', async () => {
            getApplicationDetailsInfoByParams.mockResolvedValue({ _id: 7, name: 'Checkout' });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });

            expect(sendMessage).not.toHaveBeenCalled();
        });

        it('skips when channel notifications are disabled even with an id present', async () => {
            getApplicationDetailsInfoByParams.mockResolvedValue({
                _id: 7,
                name: 'Checkout',
                slackChannelId: 'C0999',
                slackChannelNotificationsEnabled: false,
            });

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

        it('fetches audit runs for all channel applications in a single query', async () => {
            getApplicationsWithSlackChannel.mockResolvedValue([
                { _id: 7, name: 'Checkout', acronym: 'CHK', slackChannelId: 'C0999' },
                { _id: 8, name: 'Billing', acronym: 'BIL', slackChannelId: 'C0888' },
            ]);
            getAuditRunsForApplicationsSince.mockResolvedValue([
                { _id: 100, appId: 7, runStatus: 'completed' },
                { _id: 101, appId: 8, runStatus: 'completed' },
            ]);

            await channel.notify({ type: 'daily-digest', data: {} });

            expect(getAuditRunsForApplicationsSince).toHaveBeenCalledTimes(1);
            expect(getAuditRunsForApplicationsSince).toHaveBeenCalledWith([7, 8], expect.any(Date));
            expect(sendMessage).toHaveBeenCalledTimes(2);
        });

        it('lists a channel digest newest run first', async () => {
            getApplicationsWithSlackChannel.mockResolvedValue([
                { _id: 7, name: 'Checkout', acronym: 'CHK', slackChannelId: 'C0999' },
            ]);
            getAuditRunsForApplicationsSince.mockResolvedValue([
                { _id: 100, appId: 7, runStatus: 'completed' },
                { _id: 102, appId: 7, runStatus: 'failed' },
                { _id: 101, appId: 7, runStatus: 'completed' },
            ]);

            await channel.notify({ type: 'daily-digest', data: {} });

            const message = sendMessage.mock.calls[0][1] as string;
            expect(message.indexOf('run #102')).toBeLessThan(message.indexOf('run #101'));
            expect(message.indexOf('run #101')).toBeLessThan(message.indexOf('run #100'));
        });
    });
});
