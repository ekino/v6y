import { describe, expect, it } from 'vitest';

import { collectAuditRecipients, parseEmailList } from '../mailer/EmailRecipients.ts';

describe('EmailRecipients', () => {
    describe('parseEmailList', () => {
        it('returns an empty list for an empty or missing field', () => {
            expect(parseEmailList(undefined)).toEqual([]);
            expect(parseEmailList(null)).toEqual([]);
            expect(parseEmailList('   ')).toEqual([]);
        });

        it('splits on commas and semicolons and trims each address', () => {
            expect(parseEmailList('a@x.com, b@y.com ; c@z.com')).toEqual([
                'a@x.com',
                'b@y.com',
                'c@z.com',
            ]);
        });

        it('drops entries that are not valid email addresses', () => {
            expect(parseEmailList('a@x.com, not-an-email, b@y.com')).toEqual([
                'a@x.com',
                'b@y.com',
            ]);
        });
    });

    describe('collectAuditRecipients', () => {
        it('puts the opted-in owner first, then the contact addresses', () => {
            expect(
                collectAuditRecipients(
                    { email: 'owner@x.com', auditReportEmailsEnabled: true },
                    'team@x.com, ops@x.com',
                ),
            ).toEqual(['owner@x.com', 'team@x.com', 'ops@x.com']);
        });

        it('omits the owner when it opted out but keeps the contact addresses', () => {
            expect(
                collectAuditRecipients(
                    { email: 'owner@x.com', auditReportEmailsEnabled: false },
                    'team@x.com',
                ),
            ).toEqual(['team@x.com']);
        });

        it('de-duplicates addresses case-insensitively', () => {
            expect(
                collectAuditRecipients(
                    { email: 'Owner@X.com', auditReportEmailsEnabled: true },
                    'owner@x.com, team@x.com',
                ),
            ).toEqual(['Owner@X.com', 'team@x.com']);
        });

        it('returns nothing when there is neither an opted-in owner nor a contact mail', () => {
            expect(
                collectAuditRecipients(
                    { email: 'owner@x.com', auditReportEmailsEnabled: false },
                    null,
                ),
            ).toEqual([]);
        });
    });
});
