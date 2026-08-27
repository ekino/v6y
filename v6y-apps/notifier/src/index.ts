import { AppLogger, QueueConfig, ServerUtils } from '@v6y/core-logic';

import { createApp } from './app.ts';
import EmailConfig from './channels/email/EmailConfig.ts';
import ServerConfig from './config/ServerConfig.ts';
import { NotificationQueueService } from './queues/NotificationQueueService.ts';

const { createServer } = ServerUtils;
const { currentConfig } = ServerConfig;
const { port } = currentConfig;

const app = await createApp();

const httpServer = createServer({
    app: app.getHttpAdapter().getInstance(),
    config: currentConfig,
});

await new Promise((resolve) => httpServer.listen({ port }, () => resolve(null)));

httpServer.timeout = currentConfig.serverTimeout;

AppLogger.info(`[v6y-notifier] Server started at ${currentConfig.serverUrl}`);

// Re-install the daily digest scheduler on every boot so Redis flushes and
// cron changes are automatically recovered.
if (QueueConfig.isQueueEnabled()) {
    const notificationQueueService = app.get(NotificationQueueService);

    if (EmailConfig.isMailEnabled()) {
        await notificationQueueService.scheduleDailyDigest();
    } else {
        AppLogger.info(
            '[v6y-notifier] Mail delivery is not configured, the daily digest is disabled.',
        );
        await notificationQueueService.removeDailyDigestSchedule();
    }
}
