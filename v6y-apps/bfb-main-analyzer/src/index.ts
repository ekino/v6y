import { AppLogger, QueueConfig, ServerUtils } from '@v6y/core-logic';
import { EmailConfig } from '@v6y/notifications';

import { createApp } from './app.ts';
import ServerConfig from './config/ServerConfig.ts';
import { ApplicationAnalysisQueueService } from './queues/ApplicationAnalysisQueueService.ts';
import { DataUpdateQueueService } from './queues/DataUpdateQueueService.ts';
import { NotificationQueueService } from './queues/NotificationQueueService.ts';
import ApplicationScheduleReconciler from './workers/ApplicationScheduleReconciler.ts';
import DataUpdateScheduler from './workers/DataUpdateScheduler.ts';

const { createServer } = ServerUtils;

const { currentConfig } = ServerConfig;

const { port } = currentConfig || {};

// *********************************************** Server Creation & Launch ***********************************************

const app = await createApp();

const httpServer = createServer({
    app: app.getHttpAdapter().getInstance(),
    config: currentConfig,
});

await new Promise((resolve) =>
    httpServer.listen(
        {
            port,
        },
        () => resolve(null),
    ),
);

httpServer.timeout = currentConfig?.serverTimeout;

AppLogger.info(`Server started at ${currentConfig?.serverUrl}`);

// *********************************************** Data Update Scheduler ***********************************************
DataUpdateScheduler.start(app.get(DataUpdateQueueService));

// *********************************************** Audit Schedule Reconciliation ***************************************
if (QueueConfig.isQueueEnabled()) {
    ApplicationScheduleReconciler.start(app.get(ApplicationAnalysisQueueService));

    const notificationQueueService = app.get(NotificationQueueService);
    if (EmailConfig.isMailEnabled()) {
        await notificationQueueService.scheduleDailyDigest();
    } else {
        AppLogger.info('[index] Mail not configured, daily digest disabled.');
        await notificationQueueService.removeDailyDigestSchedule();
    }
} else {
    AppLogger.info(
        '[index] Queue disabled, the audit schedule reconciliation will not be started.',
    );
}
