import Express, { Express as ExpressApp } from 'express';
import ExpressStatusMonitor from 'express-status-monitor';

import ServerConfig from './config/ServerConfig.ts';

/**
 * Creates and configures the Express application with monitoring and health check
 * Note: GraphQL endpoints are configured in index.ts after Apollo Server initialization
 * @returns Configured Express app instance
 */
export function createApp(): ExpressApp {
    const app = Express();

    const { currentConfig } = ServerConfig;

    const { monitoringPath } = currentConfig || {};

    // *********************************************** Monitoring Endpoints ***********************************************

    app.use(
        ExpressStatusMonitor({
            path: monitoringPath as string,
        }),
    );

    return app;
}
