/**
 * Validation and documentation helpers for the audit reporting frequency, entered
 * in the back office as a free-form cron expression and forwarded to the main
 * analyzer (see PR #413's queue-triggered application analysis).
 */

interface AuditFrequencyExample {
    /** Suffix of the `app-audit-frequency-cron.examples.*` translation key. */
    labelKey: string;
    cron: string;
}

/**
 * Shown under the input so an admin does not have to recall the cron syntax to
 * express the common schedules.
 */
export const AUDIT_FREQUENCY_EXAMPLES: AuditFrequencyExample[] = [
    { labelKey: 'daily', cron: '0 0 * * *' },
    { labelKey: 'twice-a-day', cron: '0 0,12 * * *' },
    { labelKey: 'every-six-hours', cron: '0 */6 * * *' },
    { labelKey: 'hourly', cron: '0 * * * *' },
    { labelKey: 'weekly', cron: '0 0 * * 1' },
    { labelKey: 'monthly', cron: '0 0 1 * *' },
    { labelKey: 'weekdays', cron: '30 3 * * 1-5' },
];

export type AuditFrequencyCronError = 'syntax' | 'rate';

const MONTH_NAMES = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
];
const DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

interface FieldSpec {
    min: number;
    max: number;
    /** Accepted three-letter aliases, in ascending value order from `min`. */
    names?: string[];
}

const SECONDS_FIELD: FieldSpec = { min: 0, max: 59 };
const STANDARD_FIELDS: FieldSpec[] = [
    { min: 0, max: 59 }, // minute
    { min: 0, max: 23 }, // hour
    { min: 1, max: 31 }, // day of month
    { min: 1, max: 12, names: MONTH_NAMES }, // month
    { min: 0, max: 7, names: DAY_NAMES }, // day of week (7 is Sunday too)
];

const FIXED_VALUE_PATTERN = /^\d{1,2}$/;

const parseFieldValue = (token: string, { min, names }: FieldSpec): number | undefined => {
    const nameIndex = names?.indexOf(token.toLowerCase()) ?? -1;
    if (nameIndex >= 0) {
        return min + nameIndex;
    }

    return FIXED_VALUE_PATTERN.test(token) ? Number(token) : undefined;
};

const isFieldPartValid = (part: string, spec: FieldSpec): boolean => {
    const [rangePart, stepPart, ...extraParts] = part.split('/');

    if (extraParts.length) {
        return false;
    }

    if (stepPart !== undefined && (!FIXED_VALUE_PATTERN.test(stepPart) || Number(stepPart) < 1)) {
        return false;
    }

    if (rangePart === '*') {
        return true;
    }

    const bounds = rangePart.split('-');
    if (bounds.length > 2) {
        return false;
    }

    const values = bounds.map((bound) => parseFieldValue(bound, spec));
    if (values.some((value) => value === undefined || value < spec.min || value > spec.max)) {
        return false;
    }

    return values.length !== 2 || (values[0] as number) <= (values[1] as number);
};

const isFieldValid = (field: string, spec: FieldSpec): boolean =>
    field.split(',').every((part) => isFieldPartValid(part, spec));

/**
 * Whether a schedule runs at most once per hour, mirroring the policy the main
 * analyzer enforces in `AuditCronPolicy.ts`: a full audit clones the repository
 * and runs the static, dynamic and DevOps auditors, and a schedule repeats
 * forever, so a per-minute expression is a load generator rather than a typo.
 *
 * Keep both in sync — the server check is the one that actually protects the
 * analyzer, this one only spares the admin a round trip.
 */
const isRateAcceptable = (fields: string[]): boolean => {
    const [secondsField, minutesField] =
        fields.length === 6 ? [fields[0], fields[1]] : [undefined, fields[0]];

    if (secondsField !== undefined && !FIXED_VALUE_PATTERN.test(secondsField)) {
        return false;
    }

    return FIXED_VALUE_PATTERN.test(minutesField);
};

/**
 * The reason a cron expression is refused, or `undefined` when it is accepted.
 * An empty value is accepted here: whether the field is mandatory is the form's
 * own `required` rule to report, not this one's.
 */
export const validateAuditFrequencyCron = (
    cron?: string | null,
): AuditFrequencyCronError | undefined => {
    const fields = cron?.trim().split(/\s+/).filter(Boolean) || [];

    if (!fields.length) {
        return undefined;
    }

    // 5 fields: minute hour dayOfMonth month dayOfWeek
    // 6 fields: the same, preceded by seconds
    if (fields.length !== 5 && fields.length !== 6) {
        return 'syntax';
    }

    const specs = fields.length === 6 ? [SECONDS_FIELD, ...STANDARD_FIELDS] : STANDARD_FIELDS;
    if (!fields.every((field, index) => isFieldValid(field, specs[index]))) {
        return 'syntax';
    }

    return isRateAcceptable(fields) ? undefined : 'rate';
};
