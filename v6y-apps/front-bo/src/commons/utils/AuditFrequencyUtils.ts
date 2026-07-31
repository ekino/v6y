/**
 * Helpers translating a user-friendly "N times per period" audit reporting
 * frequency into a 5-field cron expression (and back), following PR #413's
 * queue-triggered application analysis.
 *
 * Only evenly-spaced presets are supported so the generated cron expression is
 * always exact (never rounded): a day can be split into 1/2/3/4/6/8/12/24 equal
 * slices, and a week or a month only once.
 *
 * Every preset cron is unique across periods, so `getAuditFrequencyCron` and
 * `parseAuditFrequencyCron` are exact inverses. "7 times per week" is therefore
 * deliberately absent: it is the same schedule as "1 time per day", and offering
 * both made the round-trip lossy (a schedule saved as week/7 always reloaded as
 * day/1).
 */
export type AuditFrequencyPeriod = 'day' | 'week' | 'month';

interface AuditFrequencyPreset {
    count: number;
    cron: string;
}

const AUDIT_FREQUENCY_PRESETS: Record<AuditFrequencyPeriod, AuditFrequencyPreset[]> = {
    day: [
        { count: 1, cron: '0 0 * * *' },
        { count: 2, cron: '0 */12 * * *' },
        { count: 3, cron: '0 */8 * * *' },
        { count: 4, cron: '0 */6 * * *' },
        { count: 6, cron: '0 */4 * * *' },
        { count: 8, cron: '0 */3 * * *' },
        { count: 12, cron: '0 */2 * * *' },
        { count: 24, cron: '0 * * * *' },
    ],
    week: [{ count: 1, cron: '0 0 * * 1' }],
    month: [{ count: 1, cron: '0 0 1 * *' }],
};

export const getAuditFrequencyPeriods = (): AuditFrequencyPeriod[] => ['day', 'week', 'month'];

export const getAuditFrequencyCounts = (period?: AuditFrequencyPeriod | string): number[] =>
    (AUDIT_FREQUENCY_PRESETS[period as AuditFrequencyPeriod] || []).map((preset) => preset.count);

export const getAuditFrequencyCron = (
    period?: AuditFrequencyPeriod | string,
    count?: number,
): string | undefined =>
    AUDIT_FREQUENCY_PRESETS[period as AuditFrequencyPeriod]?.find(
        (preset) => preset.count === count,
    )?.cron;

export const parseAuditFrequencyCron = (
    cron?: string | null,
): { period: AuditFrequencyPeriod; count: number } | undefined => {
    if (!cron?.length) {
        return undefined;
    }

    for (const period of getAuditFrequencyPeriods()) {
        const preset = AUDIT_FREQUENCY_PRESETS[period].find((item) => item.cron === cron);
        if (preset) {
            return { period, count: preset.count };
        }
    }

    return undefined;
};

/**
 * A cron expression the presets above cannot express (set straight in the
 * database, or left over from an older preset table) has no period/count to
 * select in the form. It is treated as a read-only "custom schedule" that the
 * form carries through untouched, rather than as an empty selection — which
 * would otherwise trip the period/count `required` rules and block every save
 * on that application, including edits to unrelated fields.
 */
export const isCustomAuditFrequencyCron = (cron?: string | null): boolean =>
    !!cron?.length && !parseAuditFrequencyCron(cron);
