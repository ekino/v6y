import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import Express, { Express as ExpressApp } from 'express';
import ExpressStatusMonitor from 'express-status-monitor';

import { AppLogger, CorsOptions } from '@v6y/core-logic';

import ServerConfig from './config/ServerConfig.ts';

const { currentConfig } = ServerConfig;

const { ssl, monitoringPath, hostname, port, healthCheckPath } = currentConfig || {};

export function createApp(): ExpressApp {
    const app = Express();

    app.use(CookieParser());
    app.use(Cors(CorsOptions));
    app.use(
        BodyParser.urlencoded({
            extended: false,
        }),
    );
    app.use(BodyParser.json());

    app.use(
        ExpressStatusMonitor({
            path: monitoringPath,
            healthChecks: [
                {
                    protocol: ssl ? 'https' : 'http',
                    host: hostname,
                    port,
                    path: healthCheckPath,
                },
            ],
        }),
    );

    app.get(healthCheckPath, (req, res) => {
        res.status(200).send('V6y Sever is UP !');
    });

    app.get('/{*any}', (request, response) => {
        AppLogger.debug(`[*] KO:  la route demandé ${request.url} n'existe pas`);
        response.status(404).send({
            success: false,
            message: "La route demandé n'existe pas",
        });
    });

    return app;
}
