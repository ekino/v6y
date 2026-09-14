import { Injectable } from '@nestjs/common';

import { AppLogger } from '@v6y/core-logic';

import { INotificationChannel, NotificationEvent } from '../channels/INotificationChannel.ts';

/**
 * Fan-out dispatcher: iterates every registered channel, skips unavailable
 * ones, and calls `notify()` on the rest.
 *
 * `Promise.allSettled` guarantees fault isolation — one broken channel never
 * prevents the others from delivering.  Each rejection is caught and logged
 * here so that channels themselves can be written without defensive wrapping.
 *
 * `channels` is a plain (undecorated) constructor parameter — see the
 * `NOTIFICATION_CHANNELS`-keyed factory provider in `app.module.ts` — because
 * tsx/esbuild does not reliably enable legacy TS decorators for files loaded
 * from a pnpm-symlinked workspace package, and `@Inject()` requires them.
 */
@Injectable()
export class NotificationDispatcher {
    constructor(private readonly channels: INotificationChannel[]) {}

    async dispatch(event: NotificationEvent): Promise<void> {
        const available = this.channels.filter((c) => c.isAvailable());

        if (!available.length) {
            AppLogger.info(
                `[NotificationDispatcher] No channels available for event "${event.type}", skipping.`,
            );
            return;
        }

        AppLogger.info(
            `[NotificationDispatcher] Dispatching "${event.type}" to ${available.map((c) => c.channelId).join(', ')}.`,
        );

        const results = await Promise.allSettled(available.map((c) => c.notify(event)));

        results.forEach((result, i) => {
            if (result.status === 'rejected') {
                AppLogger.error(
                    `[NotificationDispatcher] Channel "${available[i]!.channelId}" threw an unhandled error: `,
                    result.reason,
                );
            }
        });
    }
}
