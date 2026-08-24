import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import EmailTemplates from '../mailer/EmailTemplates.ts';

describe('EmailTemplates', () => {
    beforeEach(() => {
        process.env.V6Y_PUBLIC_APP_URL = 'https://vitality.example.com';
    });

    afterEach(() => {
        delete process.env.V6Y_PUBLIC_APP_URL;
        vi.restoreAllMocks();
    });

    describe('buildAuditRunCompletedEmail', () => {
        const baseParams = {
            username: 'jane',
            applicationId: 7,
            applicationName: 'Checkout',
            auditRunId: 42,
            runStatus: 'completed',
            branch: 'main',
            errorMessage: null,
            scores: { total: 5, success: 3, warning: 1, error: 1 },
        };

        it('announces a successful run and links to its report', () => {
            const { subject, text, html } = EmailTemplates.buildAuditRunCompletedEmail(baseParams);

            expect(subject).toBe('[Vitality] Audit report ready for Checkout');
            expect(text).toContain('5 audit(s): 3 ok, 1 to watch, 1 critical');
            expect(html).toContain('https://vitality.example.com/app/7/reports/42');
        });

        it('announces a failed run with the analyzer error message', () => {
            const { subject, text } = EmailTemplates.buildAuditRunCompletedEmail({
                ...baseParams,
                runStatus: 'failed',
                errorMessage: 'Static analysis timed out',
            });

            expect(subject).toBe('[Vitality] Audit failed for Checkout');
            expect(text).toContain('Error: Static analysis timed out');
        });

        it('escapes the application name so it cannot inject markup into the email', () => {
            const { html } = EmailTemplates.buildAuditRunCompletedEmail({
                ...baseParams,
                applicationName: '<img src=x onerror="alert(1)">',
            });

            expect(html).not.toContain('<img src=x');
            expect(html).toContain('&lt;img src=x');
        });

        it('omits the report link when no public url is configured', () => {
            delete process.env.V6Y_PUBLIC_APP_URL;

            const { html } = EmailTemplates.buildAuditRunCompletedEmail(baseParams);

            expect(html).not.toContain('See the full report');
        });
    });

    describe('buildDailyDigestEmail', () => {
        it('summarises every application of the day', () => {
            const { subject, text, html } = EmailTemplates.buildDailyDigestEmail({
                username: 'jane',
                date: new Date('2026-08-24T09:00:00.000Z'),
                applications: [
                    {
                        applicationId: 7,
                        applicationName: 'Checkout',
                        runCount: 2,
                        completedCount: 1,
                        failedCount: 1,
                        scores: { total: 4, success: 2, warning: 1, error: 1 },
                    },
                ],
            });

            expect(subject).toBe('[Vitality] Daily audit digest - 2026-08-24');
            expect(text).toContain('Checkout: 2 run(s), 1 completed, 1 failed');
            expect(html).toContain('https://vitality.example.com/app/7');
        });
    });
});
