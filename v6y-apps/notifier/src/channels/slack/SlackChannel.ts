import { Injectable } from '@nestjs/common';

import { AppLogger } from '@v6y/core-logic';

import { INotificationChannel, NotificationEvent } from '../INotificationChannel.ts';

/**
 * Slack channel stub.
 *
 * `isAvailable()` returns `false` until `V6Y_SLACK_BOT_TOKEN` is set, so the
 * dispatcher silently skips this channel in deployments that have not
 * configured Slack — zero noise, zero breakage.
 *
 * To activate Slack notifications, set `V6Y_SLACK_BOT_TOKEN` in the
 * environment and implement `notify()` with `@slack/web-api`.
 */
@Injectable()
export class SlackChannel implements INotificationChannel {
    readonly channelId = 'slack';

    isAvailable(): boolean {
        return !!process.env.V6Y_SLACK_BOT_TOKEN?.length;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async notify(_event: NotificationEvent): Promise<void> {
        AppLogger.info(
            '[SlackChannel] Slack notifications are not yet implemented in the notifier service.',
        );
    }
}
