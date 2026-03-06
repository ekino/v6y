import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import Express, { Express as ExpressApp } from 'express';
import ExpressStatusMonitor from 'express-status-monitor';

import { AppLogger, CorsOptions } from '@v6y/core-logic';

import ServerConfig from './config/ServerConfig.ts';

/**
 * Creates and configures the Express application
 * @returns Configured Express app instance
 */
export function createApp(): ExpressApp {
    const app = Express();

    const { currentConfig } = ServerConfig;

    const { monitoringPath } = currentConfig || {};

    // *********************************************** Configure Server ***********************************************

    // configure cookie parser
    app.use(CookieParser());

    // configure cors
    // https://expressjs.com/en/resources/middleware/cors.html
    app.use(Cors(CorsOptions));

    // parse application/x-www-form-urlencoded
    app.use(
        BodyParser.urlencoded({
            extended: false,
        }),
    );

    // parse application/json
    app.use(BodyParser.json());

    // *********************************************** Monitoring Endpoints ***********************************************

    app.use(
        ExpressStatusMonitor({
            path: monitoringPath,
        }),
    );

    // *********************************************** Handle Endpoints ***********************************************

    // default response (unknown routes)
    app.get('/{*any}', (request, response) => {
        AppLogger.debug(`[*] KO:  la route demandé ${request.url} n'existe pas`);
        response.status(404).send({
            success: false,
            message: "La route demandé n'existe pas",
        });
    });

    return app;
}
