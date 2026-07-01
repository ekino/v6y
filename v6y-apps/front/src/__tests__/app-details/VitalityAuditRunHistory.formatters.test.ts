import { describe, expect, it } from 'vitest';

import {
    formatDate,
    getDuration,
} from '../../features/app-details/components/audit-runs/VitalityAuditRunHistory';

describe('VitalityAuditRunHistory formatters', () => {
    it('returns fallback values for invalid timestamps', () => {
        expect(formatDate('')).toBe('-');
        expect(formatDate('not-a-date')).toBe('-');
        expect(getDuration('not-a-date', 'still-not-a-date')).toBeNull();
        expect(getDuration('not-a-date', '1735689600')).toBeNull();
    });

    it('supports unix timestamps in seconds and milliseconds for duration', () => {
        expect(getDuration('1735689600', '1735689660')).toBe('1m');
        expect(getDuration('1735689600000', '1735689720000')).toBe('2m');
    });

    it('returns null duration for negative time ranges', () => {
        expect(getDuration('1735689720', '1735689600')).toBeNull();
    });

    it('formats valid dates into a display value', () => {
        expect(formatDate('2026-06-15T10:30:00.000Z')).not.toBe('-');
    });
});
