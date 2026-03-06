import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import expressStatusMonitor from 'express-status-monitor';

import { AppLogger, CorsOptions } from '@v6y/core-logic';

import ServerConfig from './commons/ServerConfig.ts';
import DevOpsAuditorRouter from './routes/DevOpsAuditorRouter.ts';

/**
 * Creates and configures the Express application
 * @returns Configured Express app instance
 */
export function createApp(): Express {
    const app = express();

    const { currentConfig } = ServerConfig;

    const { monitoringPath, devopsAuditorApiPath } = currentConfig || {};

    // *********************************************** Server Configuration ***********************************************

    // Cookie Parser: Parses cookies from incoming requests.
    app.use(cookieParser());

    // CORS (Cross-Origin Resource Sharing): Configures the server to allow requests from other origins.
    app.use(cors(CorsOptions));

    // Body Parser: Parses incoming request bodies in different formats (URL-encoded, JSON).
    app.use(bodyParser.json());

    // *********************************************** Monitoring ***********************************************

    // Express Status Monitor: Adds a monitoring dashboard accessible at the specified path.
    app.use(
        expressStatusMonitor({
            path: monitoringPath,
        }),
    );

    // *********************************************** App Auditor Routes ***********************************************
    app.use(devopsAuditorApiPath || '', DevOpsAuditorRouter);

    // *********************************************** Default Route (404) ***********************************************

    // Default Route: Handles requests to unknown routes and returns a 404 Not Found response.
    app.get('/{*any}', (request, response) => {
        AppLogger.debug(`[*] KO: Requested route ${request.url} does not exist`);
        response.status(404).json({
            success: false,
            message: 'The requested route does not exist',
        });
    });

    return app;
}
