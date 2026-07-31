/**
 * Rate policy applied to the cron expressions accepted by the audit scheduling
 * endpoint.
 *
 * `node-cron`'s `validate` only checks syntax, and it accepts 6-field patterns:
 * `* * * * * *` is a syntactically valid expression that would clone the
 * repository and run the static, dynamic and DevOps audits every second, for as
 * long as the scheduler lives. Since a schedule is persistent and self-repeating,
 * an over-frequent pattern is a load generator rather than a one-off mistake.
 *
 * The rule below caps a schedule at one run per hour by requiring the seconds
 * (when present) and minutes fields to pin a single value. That admits every
 * back-office preset — whose densest option is the hourly `0 * * * *` — as well
 * as hand-written expressions such as `0 30 3 * * 1-5`, while rejecting
 * per-second and per-minute patterns.
 */
const FIXED_FIELD_PATTERN = /^\d{1,2}$/;

export const isAuditCronRateAcceptable = (cron?: string | null): boolean => {
    const fields = cron?.trim().split(/\s+/) || [];

    // 5 fields: minute hour dayOfMonth month dayOfWeek
    // 6 fields: second minute hour dayOfMonth month dayOfWeek
    if (fields.length !== 5 && fields.length !== 6) {
        return false;
    }

    const [secondsField, minutesField] =
        fields.length === 6 ? [fields[0], fields[1]] : [undefined, fields[0]];

    if (secondsField !== undefined && !FIXED_FIELD_PATTERN.test(secondsField)) {
        return false;
    }

    return FIXED_FIELD_PATTERN.test(minutesField);
};
