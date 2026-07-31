import { describe, expect, it } from 'vitest';

import { isAuditCronRateAcceptable } from '../config/AuditCronPolicy.ts';

describe('AuditCronPolicy', () => {
    it('accepts every expression the back office documents as an example', () => {
        // Kept in sync with AUDIT_FREQUENCY_EXAMPLES in the front-bo
        // AuditFrequencyUtils: an example the analyzer refuses would be a schedule
        // the back office invites an admin to enter and then fails to install.
        const documentedExamples = [
            '0 0 * * *',
            '0 0,12 * * *',
            '0 */6 * * *',
            '0 * * * *',
            '0 0 * * 1',
            '0 0 1 * *',
            '30 3 * * 1-5',
        ];

        for (const example of documentedExamples) {
            expect(isAuditCronRateAcceptable(example), example).toBe(true);
        }
    });

    it('accepts a hand-written expression that pins a minute', () => {
        expect(isAuditCronRateAcceptable('15 2 * */2 *')).toBe(true);
        expect(isAuditCronRateAcceptable('0 30 3 * * 1-5')).toBe(true);
    });

    it('rejects the per-second and per-minute expressions node-cron considers valid', () => {
        expect(isAuditCronRateAcceptable('* * * * * *')).toBe(false);
        expect(isAuditCronRateAcceptable('* * * * *')).toBe(false);
        expect(isAuditCronRateAcceptable('*/1 * * * * *')).toBe(false);
        expect(isAuditCronRateAcceptable('*/5 * * * *')).toBe(false);
    });

    it('rejects anything that is not a 5 or 6 field expression', () => {
        expect(isAuditCronRateAcceptable('')).toBe(false);
        expect(isAuditCronRateAcceptable(undefined)).toBe(false);
        expect(isAuditCronRateAcceptable(null)).toBe(false);
        expect(isAuditCronRateAcceptable('0 0 * *')).toBe(false);
        expect(isAuditCronRateAcceptable('0 0 0 0 * * *')).toBe(false);
    });

    it('ignores the surrounding whitespace instead of rejecting on it', () => {
        expect(isAuditCronRateAcceptable('  0   */6 * * *  ')).toBe(true);
    });
});
