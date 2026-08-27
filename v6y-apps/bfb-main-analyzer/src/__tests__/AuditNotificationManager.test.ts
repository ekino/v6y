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

vi.mock('../mailer/MailerService.ts', () => ({
    default: { sendMail },
}));

const { default: AuditNotificationManager } = await import(
    '../managers/AuditNotificationManager.ts'
);

describe('AuditNotificationManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.V6Y_MAIL_SMTP_HOST = 'smtp.example.com';
        sendMail.mockResolvedValue(true);
    });

    afterEach(() => {
        delete process.env.V6Y_MAIL_SMTP_HOST;
    });

    describe('notifyAuditRunCompleted', () => {
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

            await expect(AuditNotificationManager.notifyAuditRunCompleted(42)).resolves.toBe(true);
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

            await expect(AuditNotificationManager.notifyAuditRunCompleted(42)).resolves.toBe(true);
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

            await expect(AuditNotificationManager.notifyAuditRunCompleted(42)).resolves.toBe(true);
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

            await expect(AuditNotificationManager.notifyAuditRunCompleted(42)).resolves.toBe(true);
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

            await expect(AuditNotificationManager.notifyAuditRunCompleted(42)).resolves.toBe(false);
            expect(sendMail).not.toHaveBeenCalled();
        });

        it('sends nothing when mail delivery is not configured', async () => {
            delete process.env.V6Y_MAIL_SMTP_HOST;

            await expect(AuditNotificationManager.notifyAuditRunCompleted(42)).resolves.toBe(false);
            expect(getAuditRunWithAudits).not.toHaveBeenCalled();
        });

        it('reports a failure instead of throwing when the audit run cannot be read', async () => {
            getAuditRunWithAudits.mockRejectedValue(new Error('database unreachable'));

            await expect(AuditNotificationManager.notifyAuditRunCompleted(42)).resolves.toBe(false);
        });
    });

    describe('sendDailyDigests', () => {
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

            await expect(AuditNotificationManager.sendDailyDigests()).resolves.toBe(1);
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

            await expect(AuditNotificationManager.sendDailyDigests()).resolves.toBe(0);
            expect(sendMail).not.toHaveBeenCalled();
        });

        it('throws when the recipients cannot be read, so the job is retried', async () => {
            getDailyDigestRecipients.mockResolvedValue(null);

            await expect(AuditNotificationManager.sendDailyDigests()).rejects.toThrow();
        });
    });
});
