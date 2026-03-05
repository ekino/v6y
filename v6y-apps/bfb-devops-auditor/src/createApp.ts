import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import expressStatusMonitor from 'express-status-monitor';

import { AppLogger, CorsOptions } from '@v6y/core-logic';

import ServerConfig from './commons/ServerConfig.ts';
import DevOpsAuditorRouter from './routes/DevOpsAuditorRouter.ts';

const { currentConfig } = ServerConfig;

const { ssl, monitoringPath, hostname, port, healthCheckPath, devopsAuditorApiPath } =
    currentConfig || {};

export function createApp(): Express {
    const app = express();

    app.use(cookieParser());
    app.use(cors(CorsOptions));
    app.use(bodyParser.json());

    app.use(
        expressStatusMonitor({
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
        res.status(200).send('V6y Server is UP!');
    });

    app.use(devopsAuditorApiPath || '', DevOpsAuditorRouter);

    app.get('/{*any}', (request, response) => {
        AppLogger.debug(`[*] KO: Requested route ${request.url} does not exist`);
        response.status(404).json({
            success: false,
            message: 'The requested route does not exist',
        });
    });

    return app;
}
