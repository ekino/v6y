import { AppLogger, ServerUtils } from '@v6y/core-logic';

import ServerConfig from './commons/ServerConfig.ts';
import { createApp } from './createApp.ts';

const { createServer } = ServerUtils;
const { currentConfig } = ServerConfig;

const { port, serverTimeout, serverUrl } = currentConfig || {};

const app = createApp();

const httpServer = createServer({
    app,
    config: currentConfig,
});

await new Promise((resolve) => httpServer.listen({ port }, () => resolve(null)));

httpServer.timeout = serverTimeout;

AppLogger.info(`🚀 Server started at ${serverUrl}`);
