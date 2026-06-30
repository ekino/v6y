import { AppLogger, DataBaseManager, ServerUtils } from '@v6y/core-logic';

import { createApp } from './app.ts';
import ServerConfig from './config/ServerConfig.ts';

const { createServer } = ServerUtils;

const { currentConfig } = ServerConfig;

// *********************************************** App & HTTP Server Creation ***********************************************

const app = await createApp();

const httpServer = createServer({
    app: app.getHttpAdapter().getInstance(),
    config: currentConfig,
});

// *********************************************** DataBase Config & Launch ***********************************************

await DataBaseManager.connect();

// *********************************************** Server Config & Launch ***********************************************

await new Promise((resolve) =>
    httpServer.listen(
        {
            port: currentConfig?.port,
        },
        () => resolve(null),
    ),
);

httpServer.timeout = currentConfig?.serverTimeout as number; // milliseconds

AppLogger.info(`Server started at ${currentConfig?.serverUrl}`);
