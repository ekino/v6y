/**
 * Notification queue — the analyzer is the producer, the `v6y-notifier`
 * service is the consumer.  These constants must stay in sync with the
 * identical set in `v6y-apps/notifier/src/queues/NotificationQueue.ts`.
 */
export const NOTIFICATION_QUEUE = 'notification';

/** Enqueued by the analyzer after each audit run finishes (pass or fail). */
export const AUDIT_RUN_COMPLETED_JOB = 'audit-run-completed';
