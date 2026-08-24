/**
 * Notification delivery, kept on its own queue so a digest is never stuck behind
 * an audit or a catalog sweep: an email that arrives hours late is an email that
 * arrives after the day it summarizes.
 */
export const NOTIFICATION_QUEUE = 'notification';

export const DAILY_DIGEST_JOB = 'daily-digest';

/**
 * Id of the BullMQ job scheduler backing the recurring daily digest. There is a
 * single one for the whole platform: the digest fans out to every subscriber
 * itself.
 */
export const DAILY_DIGEST_SCHEDULE = 'daily-digest-schedule';
