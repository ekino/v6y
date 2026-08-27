import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { HealthController, QueueConfig } from '@v6y/core-logic';

import { NOTIFICATION_CHANNELS } from './channels/INotificationChannel.ts';
import { EmailChannel } from './channels/email/EmailChannel.ts';
import { SlackChannel } from './channels/slack/SlackChannel.ts';
import { NotificationDispatcher } from './dispatcher/NotificationDispatcher.ts';
import { NotificationProcessor } from './queues/NotificationProcessor.ts';
import { NOTIFICATION_QUEUE } from './queues/NotificationQueue.ts';
import { NotificationQueueService } from './queues/NotificationQueueService.ts';

const queueEnabled = QueueConfig.isQueueEnabled();

const queueImports = queueEnabled
    ? [
          BullModule.forRoot({
              connection: QueueConfig.buildQueueConnection(),
              prefix: QueueConfig.buildQueuePrefix(),
          }),
          BullModule.registerQueue({ name: NOTIFICATION_QUEUE }),
      ]
    : [];

const queueProviders = queueEnabled ? [NotificationProcessor] : [];

/**
 * Channel registry.
 *
 * To add a new channel (e.g. Teams):
 *   1. Create `src/channels/teams/TeamsChannel.ts` implementing `INotificationChannel`.
 *   2. Add `TeamsChannel` to `channelProviders` below.
 *   3. That is all — the dispatcher picks it up automatically.
 */
const channelProviders = [EmailChannel, SlackChannel];

const channelMultiProviders = channelProviders.map((Channel) => ({
    provide: NOTIFICATION_CHANNELS,
    useExisting: Channel,
}));

@Module({
    imports: [...queueImports],
    controllers: [HealthController],
    providers: [
        ...channelProviders,
        ...channelMultiProviders,
        NotificationDispatcher,
        NotificationQueueService,
        ...queueProviders,
    ],
})
export class AppModule {}
