import { AppLogger, QueueConfig, ServerUtils } from '@v6y/core-logic';

import { createApp } from './app.ts';
import ServerConfig from './config/ServerConfig.ts';
import { ApplicationAnalysisQueueService } from './queues/ApplicationAnalysisQueueService.ts';
import { DataUpdateQueueService } from './queues/DataUpdateQueueService.ts';
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
// Redis is where the audit job schedulers live, but the database is what says
// which applications should have one, so they are realigned here rather than
// assumed to be in sync.
if (QueueConfig.isQueueEnabled()) {
    ApplicationScheduleReconciler.start(app.get(ApplicationAnalysisQueueService));
} else {
    AppLogger.info(
        '[index] Queue disabled, the audit schedule reconciliation will not be started.',
    );
}
