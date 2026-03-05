import { AppLogger, ServerUtils } from '@v6y/core-logic';

import ServerConfig from './config/ServerConfig.ts';
import { createApp } from './createApp.ts';
import DataUpdateScheduler from './workers/DataUpdateScheduler.ts';

const { createServer } = ServerUtils;

const { currentConfig } = ServerConfig;

const { port } = currentConfig || {};

const app = createApp();

const httpServer = createServer({
    app,
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

AppLogger.info(`🚀 Server started at ${currentConfig?.serverUrl}`);

DataUpdateScheduler.start();
