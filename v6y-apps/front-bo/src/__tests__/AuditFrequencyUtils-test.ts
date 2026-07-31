import { describe, expect, it } from 'vitest';

import {
    AUDIT_FREQUENCY_EXAMPLES,
    validateAuditFrequencyCron,
} from '../commons/utils/AuditFrequencyUtils';

describe('AuditFrequencyUtils', () => {
    it('should accept every expression offered as an example', () => {
        // The examples are what an admin is invited to copy, so a refused one is a
        // bug in the list, not in the input.
        for (const { cron } of AUDIT_FREQUENCY_EXAMPLES) {
            expect(validateAuditFrequencyCron(cron), cron).toBeUndefined();
        }
    });

    it('should accept the common 5-field expressions', () => {
        expect(validateAuditFrequencyCron('0 0 * * *')).toBeUndefined();
        expect(validateAuditFrequencyCron('0 * * * *')).toBeUndefined();
        expect(validateAuditFrequencyCron('30 3 * * 1-5')).toBeUndefined();
        expect(validateAuditFrequencyCron('0 0,6,12,18 1,15 * *')).toBeUndefined();
        expect(validateAuditFrequencyCron('15 2 * */2 *')).toBeUndefined();
    });

    it('should accept a 6-field expression whose seconds are pinned', () => {
        expect(validateAuditFrequencyCron('0 30 3 * * 1-5')).toBeUndefined();
    });

    it('should accept the three-letter month and day aliases', () => {
        expect(validateAuditFrequencyCron('0 4 * jan mon')).toBeUndefined();
        expect(validateAuditFrequencyCron('0 4 * JAN-MAR MON-FRI')).toBeUndefined();
    });

    it('should accept surrounding and repeated whitespace', () => {
        expect(validateAuditFrequencyCron('  0   0 * * *  ')).toBeUndefined();
    });

    it('should treat an empty value as the required rule concern, not its own', () => {
        expect(validateAuditFrequencyCron('')).toBeUndefined();
        expect(validateAuditFrequencyCron('   ')).toBeUndefined();
        expect(validateAuditFrequencyCron(undefined)).toBeUndefined();
        expect(validateAuditFrequencyCron(null)).toBeUndefined();
    });

    it('should reject an expression that is not 5 or 6 fields', () => {
        expect(validateAuditFrequencyCron('0 0 * *')).toBe('syntax');
        expect(validateAuditFrequencyCron('0 0 0 0 * * *')).toBe('syntax');
    });

    it('should reject out-of-range and malformed fields', () => {
        expect(validateAuditFrequencyCron('0 24 * * *')).toBe('syntax');
        expect(validateAuditFrequencyCron('0 0 32 * *')).toBe('syntax');
        expect(validateAuditFrequencyCron('0 0 * 13 *')).toBe('syntax');
        expect(validateAuditFrequencyCron('0 0 * * 8')).toBe('syntax');
        expect(validateAuditFrequencyCron('0 0 * * mun')).toBe('syntax');
        expect(validateAuditFrequencyCron('0 5-2 * * *')).toBe('syntax');
        expect(validateAuditFrequencyCron('0 0/0 * * *')).toBe('syntax');
        expect(validateAuditFrequencyCron('0 0/2/3 * * *')).toBe('syntax');
        expect(validateAuditFrequencyCron('0 0,,1 * * *')).toBe('syntax');
        expect(validateAuditFrequencyCron('every minute please')).toBe('syntax');
    });

    it('should reject a schedule running more than once per hour', () => {
        // Syntactically valid, and each run clones the repository and executes the
        // full audit suite, so these are refused rather than installed.
        expect(validateAuditFrequencyCron('* * * * *')).toBe('rate');
        expect(validateAuditFrequencyCron('*/5 * * * *')).toBe('rate');
        expect(validateAuditFrequencyCron('0-30 * * * *')).toBe('rate');
        expect(validateAuditFrequencyCron('0,30 * * * *')).toBe('rate');
        expect(validateAuditFrequencyCron('* * * * * *')).toBe('rate');
        expect(validateAuditFrequencyCron('*/10 0 * * *')).toBe('rate');
    });

    it('should report the syntax error first when an expression is both invalid and too frequent', () => {
        expect(validateAuditFrequencyCron('* 24 * * *')).toBe('syntax');
    });
});
