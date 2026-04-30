import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import expressStatusMonitor from 'express-status-monitor';

import { AppLogger, CorsOptions } from '@v6y/core-logic';

import ServerConfig from './commons/ServerConfig.ts';
import SonarQubeAuditorRouter from './routes/SonarQubeAuditorRouter.ts';

/**
 * Creates and configures the Express application
 * @returns Configured Express app instance
 */
export function createApp(): Express {
    const app = express();

    const { currentConfig } = ServerConfig;

    const { monitoringPath, sonarqubeAuditorApiPath } = currentConfig || {};

    // *********************************************** Server Configuration ***********************************************

    app.use(cookieParser());

    app.use(cors(CorsOptions));

    app.use(bodyParser.json());

    // *********************************************** Monitoring ***********************************************

    app.use(
        expressStatusMonitor({
            path: monitoringPath,
        }),
    );

    // *********************************************** App Auditor Routes ***********************************************
    app.use(sonarqubeAuditorApiPath || '', SonarQubeAuditorRouter);

    // *********************************************** Default Route (404) ***********************************************

    app.get('/{*any}', (request, response) => {
        AppLogger.debug(`[*] KO: Requested route ${request.url} does not exist`);
        response.status(404).json({
            success: false,
            message: 'The requested route does not exist',
        });
    });

    return app;
}
