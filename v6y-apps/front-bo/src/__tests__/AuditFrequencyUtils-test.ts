import { describe, expect, it } from 'vitest';

import {
    getAuditFrequencyCounts,
    getAuditFrequencyCron,
    getAuditFrequencyPeriods,
    parseAuditFrequencyCron,
} from '../commons/utils/AuditFrequencyUtils';

describe('AuditFrequencyUtils', () => {
    it('should list the supported periods', () => {
        expect(getAuditFrequencyPeriods()).toEqual(['day', 'week', 'month']);
    });

    it('should list the supported counts for each period', () => {
        expect(getAuditFrequencyCounts('day')).toEqual([1, 2, 3, 4, 6, 8, 12, 24]);
        expect(getAuditFrequencyCounts('week')).toEqual([1, 7]);
        expect(getAuditFrequencyCounts('month')).toEqual([1]);
        expect(getAuditFrequencyCounts(undefined)).toEqual([]);
    });

    it('should compute the correct cron expression for a given period/count', () => {
        expect(getAuditFrequencyCron('day', 1)).toBe('0 0 * * *');
        expect(getAuditFrequencyCron('day', 4)).toBe('0 */6 * * *');
        expect(getAuditFrequencyCron('day', 24)).toBe('0 * * * *');
        expect(getAuditFrequencyCron('week', 1)).toBe('0 0 * * 1');
        expect(getAuditFrequencyCron('week', 7)).toBe('0 0 * * *');
        expect(getAuditFrequencyCron('month', 1)).toBe('0 0 1 * *');
    });

    it('should return undefined for an unsupported period/count combination', () => {
        expect(getAuditFrequencyCron('day', 5)).toBeUndefined();
        expect(getAuditFrequencyCron(undefined, 1)).toBeUndefined();
    });

    it('should parse a known cron expression back into a period/count', () => {
        expect(parseAuditFrequencyCron('0 */6 * * *')).toEqual({ period: 'day', count: 4 });
        expect(parseAuditFrequencyCron('0 0 * * 1')).toEqual({ period: 'week', count: 1 });
        expect(parseAuditFrequencyCron('0 0 1 * *')).toEqual({ period: 'month', count: 1 });
    });

    it('should return undefined when parsing an unknown or empty cron expression', () => {
        expect(parseAuditFrequencyCron('* * * * *')).toBeUndefined();
        expect(parseAuditFrequencyCron(undefined)).toBeUndefined();
        expect(parseAuditFrequencyCron(null)).toBeUndefined();
        expect(parseAuditFrequencyCron('')).toBeUndefined();
    });
});
