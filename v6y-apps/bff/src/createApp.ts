import Express, { Express as ExpressApp } from 'express';
import ExpressStatusMonitor from 'express-status-monitor';

import ServerConfig from './config/ServerConfig.ts';

const { currentConfig } = ServerConfig;

const { ssl, monitoringPath, hostname, port, healthCheckPath } = currentConfig || {};

export function createApp(): ExpressApp {
    const app = Express();

    app.use(
        ExpressStatusMonitor({
            path: monitoringPath as string,
            healthChecks: [
                {
                    protocol: ssl ? 'https' : 'http',
                    host: hostname as string,
                    port: port,
                    path: healthCheckPath as string,
                },
            ],
        }),
    );

    app.get(healthCheckPath as string, (req, res) => {
        res.status(200).send('V6y Sever is UP !');
    });

    return app;
}
