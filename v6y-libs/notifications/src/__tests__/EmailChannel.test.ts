import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const getAuditRunWithAudits = vi.fn();
const getAuditRunsForApplicationsSince = vi.fn();
const getApplicationOwner = vi.fn();
const getApplicationDetailsInfoByParams = vi.fn();
const getDailyDigestRecipients = vi.fn();
const sendMail = vi.fn();

vi.mock('@v6y/core-logic', () => ({
    AppLogger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
    AccountProvider: { getDailyDigestRecipients },
    ApplicationProvider: { getApplicationOwner, getApplicationDetailsInfoByParams },
    AuditRunProvider: { getAuditRunWithAudits, getAuditRunsForApplicationsSince },
}));

vi.mock('../channels/email/EmailMailerService.ts', () => ({
    default: { sendMail },
}));

const { EmailChannel } = await import('../channels/email/EmailChannel.ts');

describe('EmailChannel', () => {
    let channel: InstanceType<typeof EmailChannel>;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.V6Y_MAIL_SMTP_HOST = 'smtp.example.com';
        sendMail.mockResolvedValue(true);
        channel = new EmailChannel();
    });

    afterEach(() => {
        delete process.env.V6Y_MAIL_SMTP_HOST;
    });

    describe('isAvailable()', () => {
        it('returns true when SMTP host is configured', () => {
            expect(channel.isAvailable()).toBe(true);
        });

        it('returns false when SMTP host is absent', () => {
            delete process.env.V6Y_MAIL_SMTP_HOST;
            expect(channel.isAvailable()).toBe(false);
        });
    });

    describe('notify — audit-run-completed', () => {
        beforeEach(() => {
            getAuditRunWithAudits.mockResolvedValue({
                _id: 42,
                appId: 7,
                runStatus: 'completed',
                branch: 'main',
                errorMessage: null,
                audits: [{ scoreStatus: 'success' }, { scoreStatus: 'error' }],
            });
            getApplicationDetailsInfoByParams.mockResolvedValue({ _id: 7, name: 'Checkout' });
        });

        it('emails the owner of the audited application', async () => {
            getApplicationOwner.mockResolvedValue({
                _id: 3,
                username: 'jane',
                email: 'jane@example.com',
                auditReportEmailsEnabled: true,
            });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });
            expect(sendMail).toHaveBeenCalledWith(
                expect.objectContaining({ to: ['jane@example.com'] }),
            );
        });

        it('also emails every address listed in the project contact mail', async () => {
            getApplicationOwner.mockResolvedValue({
                _id: 3,
                username: 'jane',
                email: 'jane@example.com',
                auditReportEmailsEnabled: true,
            });
            getApplicationDetailsInfoByParams.mockResolvedValue({
                _id: 7,
                name: 'Checkout',
                contactMail: 'team@example.com, ops@example.com',
            });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });
            expect(sendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: ['jane@example.com', 'team@example.com', 'ops@example.com'],
                }),
            );
        });

        it('still emails the contact mail when the owner opted out', async () => {
            getApplicationOwner.mockResolvedValue({
                _id: 3,
                username: 'jane',
                email: 'jane@example.com',
                auditReportEmailsEnabled: false,
            });
            getApplicationDetailsInfoByParams.mockResolvedValue({
                _id: 7,
                name: 'Checkout',
                contactMail: 'team@example.com;ops@example.com',
            });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });
            expect(sendMail).toHaveBeenCalledWith(
                expect.objectContaining({ to: ['team@example.com', 'ops@example.com'] }),
            );
        });

        it('de-duplicates an address shared by the owner and the contact mail', async () => {
            getApplicationOwner.mockResolvedValue({
                _id: 3,
                username: 'jane',
                email: 'jane@example.com',
                auditReportEmailsEnabled: true,
            });
            getApplicationDetailsInfoByParams.mockResolvedValue({
                _id: 7,
                name: 'Checkout',
                contactMail: 'JANE@example.com, team@example.com',
            });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });
            expect(sendMail).toHaveBeenCalledWith(
                expect.objectContaining({ to: ['jane@example.com', 'team@example.com'] }),
            );
        });

        it('sends nothing when the owner opted out and there is no contact mail', async () => {
            getApplicationOwner.mockResolvedValue({
                _id: 3,
                username: 'jane',
                email: 'jane@example.com',
                auditReportEmailsEnabled: false,
            });

            await channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } });
            expect(sendMail).not.toHaveBeenCalled();
        });

        it('does not throw when the audit run cannot be read', async () => {
            getAuditRunWithAudits.mockRejectedValue(new Error('database unreachable'));

            await expect(
                channel.notify({ type: 'audit-run-completed', data: { auditRunId: 42 } }),
            ).resolves.not.toThrow();
        });
    });

    describe('notify — daily-digest', () => {
        it('sends one digest per subscriber that had audit runs', async () => {
            getDailyDigestRecipients.mockResolvedValue([
                {
                    _id: 3,
                    username: 'jane',
                    email: 'jane@example.com',
                    applications: [{ _id: 7, name: 'Checkout', acronym: 'CHK' }],
                },
            ]);
            getAuditRunsForApplicationsSince.mockResolvedValue([
                { _id: 1, appId: 7, runStatus: 'completed', audits: [{ scoreStatus: 'success' }] },
            ]);

            await channel.notify({ type: 'daily-digest', data: {} });
            expect(sendMail).toHaveBeenCalledWith(
                expect.objectContaining({ to: 'jane@example.com' }),
            );
        });

        it('skips a subscriber whose applications had no audit run', async () => {
            getDailyDigestRecipients.mockResolvedValue([
                {
                    _id: 3,
                    username: 'jane',
                    email: 'jane@example.com',
                    applications: [{ _id: 7, name: 'Checkout', acronym: 'CHK' }],
                },
            ]);
            getAuditRunsForApplicationsSince.mockResolvedValue([]);

            await channel.notify({ type: 'daily-digest', data: {} });
            expect(sendMail).not.toHaveBeenCalled();
        });

        it('does not throw when recipients cannot be read', async () => {
            getDailyDigestRecipients.mockResolvedValue(null);

            await expect(channel.notify({ type: 'daily-digest', data: {} })).resolves.not.toThrow();
        });
    });
});
