/**
 * On-demand, per-application audits. The scheduled full-catalog refresh lives on
 * DATA_UPDATE_QUEUE so a user-triggered audit is never stuck behind a sweep of
 * every application.
 */
export const APPLICATION_ANALYSIS_QUEUE = 'application-analysis';

export const APPLICATION_ANALYSIS_SINGLE_JOB = 'application-analysis';

/**
 * Prefix for the BullMQ job scheduler id backing an application's recurring
 * "audit reporting frequency" (one repeatable job scheduler per application).
 */
export const APPLICATION_ANALYSIS_SCHEDULE = 'application-schedule';
