import { AppLogger, ServerUtils } from '@v6y/core-logic';

import { createApp } from './app.ts';
import ServerConfig from './commons/ServerConfig.ts';

const { createServer } = ServerUtils;
const { currentConfig } = ServerConfig;

const { port, serverTimeout, serverUrl } = currentConfig || {};

// *********************************************** Server Creation & Launch ***********************************************

const app = createApp();

const httpServer = createServer({
    app,
    config: currentConfig,
});

await new Promise((resolve) => httpServer.listen({ port }, () => resolve(null)));

httpServer.timeout = serverTimeout;

AppLogger.info(`🚀 SonarQube Auditor started at ${serverUrl}`);
