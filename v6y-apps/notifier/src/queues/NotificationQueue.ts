/**
 * Shared constants for the notification BullMQ queue.
 *
 * Both the producer (`bfb-main-analyzer`) and the consumer (`notifier`) use
 * these values.  Keeping them in sync is the only contract between the two
 * services.
 */
export const NOTIFICATION_QUEUE = 'notification';

/** Job enqueued by the analyzer after each audit run completes. */
export const AUDIT_RUN_COMPLETED_JOB = 'audit-run-completed';

/** Job triggered by the daily cron scheduler. */
export const DAILY_DIGEST_JOB = 'daily-digest';

/** Id of the BullMQ job scheduler for the recurring daily digest. */
export const DAILY_DIGEST_SCHEDULE = 'daily-digest-schedule';
