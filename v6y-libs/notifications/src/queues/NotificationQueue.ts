/** BullMQ queue shared between the analyzer (producer) and its in-process consumer. */
export const NOTIFICATION_QUEUE = 'notification';

export const AUDIT_RUN_COMPLETED_JOB = 'audit-run-completed';

export const DAILY_DIGEST_JOB = 'daily-digest';

/** Id of the BullMQ job scheduler for the recurring daily digest. */
export const DAILY_DIGEST_SCHEDULE = 'daily-digest-schedule';
