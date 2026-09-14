/**
 * Contract that every notification channel must implement.
 *
 * A channel represents a single delivery mechanism (email, Slack, Teams, …).
 * The dispatcher iterates every registered channel, skips those that return
 * `false` from `isAvailable()`, and calls `notify()` on the rest.  Failures
 * inside `notify()` are isolated per-channel: one broken transport never
 * prevents the others from delivering.
 *
 * Adding a new channel = one file + one registration in `app.module.ts`.
 * Nothing else needs to change.
 */

export const NOTIFICATION_CHANNELS = Symbol('NOTIFICATION_CHANNELS');

/** Shape of the data carried by an audit-run-completed event. */
export interface AuditRunCompletedPayload {
    auditRunId: number;
}

/** Shape of the data carried by a daily-digest event (no extra data needed). */
export type DailyDigestPayload = Record<string, never>;

/** Discriminated union of all notification events the platform emits. */
export type NotificationEvent =
    | { type: 'audit-run-completed'; data: AuditRunCompletedPayload }
    | { type: 'daily-digest'; data: DailyDigestPayload };

export interface INotificationChannel {
    /** Human-readable identifier used in logs, e.g. `'email'`, `'slack'`. */
    readonly channelId: string;

    /**
     * Return `true` only when this channel is fully configured and ready to
     * deliver.  A channel that returns `false` is silently skipped — it does
     * not produce an error.
     */
    isAvailable(): boolean;

    /**
     * Deliver the notification for the given event.  Must never throw: any
     * delivery problem should be caught internally and logged.
     */
    notify(event: NotificationEvent): Promise<void>;
}
