/**
 * The scheduled database refreshes: the full application catalog sweep plus the
 * keyword and evolution rebuilds.
 *
 * They share one queue so they keep running one after another as they always have,
 * while staying off APPLICATION_ANALYSIS_QUEUE: the catalog sweep can take hours,
 * and a user-triggered audit must not wait behind it.
 */
export const DATA_UPDATE_QUEUE = 'data-update';

export const APPLICATION_LIST_UPDATE_JOB = 'application-list-update';
export const KEYWORD_UPDATE_JOB = 'keyword-update';
export const EVOLUTION_UPDATE_JOB = 'evolution-update';
export const SLACK_DIGEST_JOB = 'slack-digest';

/** Default cron: every day at 08:00 UTC. Configurable via V6Y_SLACK_DIGEST_CRON. */
export const SLACK_DIGEST_CRON = process.env.V6Y_SLACK_DIGEST_CRON ?? '0 8 * * *';
