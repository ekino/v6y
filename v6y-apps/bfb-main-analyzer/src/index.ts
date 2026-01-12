import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import Express from 'express';
import ExpressStatusMonitor from 'express-status-monitor';

import { AppLogger, CorsOptions, DataBaseManager, ServerUtils } from '@v6y/core-logic';

import ServerConfig from './config/ServerConfig.ts';
import ApplicationManager from './managers/ApplicationManager.ts';
import DataUpdateScheduler from './workers/DataUpdateScheduler.ts';

const { createServer } = ServerUtils;

const { currentConfig } = ServerConfig;

const { ssl, monitoringPath, hostname, port, healthCheckPath } = currentConfig || {};

const app = Express();

const httpServer = createServer({
    app,
    config: currentConfig,
});

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

// *********************************************** Health Check Endpoints ***********************************************

app.get(healthCheckPath, (req, res) => {
    res.status(200).send('V6y Sever is UP !');
});

// *********************************************** Audit Trigger Endpoint ***********************************************

app.post('/analyze', async (req, res) => {
    try {
        const { applicationId, branch } = req.body;

        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: 'applicationId is required',
            });
        }

        AppLogger.info(
            `[MainAnalyzer - /analyze] Received audit request for applicationId: ${applicationId}, branch: ${branch}`,
        );

        // Trigger the build process for the application
        const result = await ApplicationManager.buildApplicationDetailsByParams({
            applicationId,
            branch: branch ? { name: branch } : undefined,
        });

        AppLogger.info(`[MainAnalyzer - /analyze] Build result: ${result}`);

        if (result) {
            return res.status(200).json({
                success: true,
                message: 'Audit triggered successfully',
                applicationId,
                branch,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to trigger audit',
            });
        }
    } catch (error) {
        AppLogger.error(`[MainAnalyzer - /analyze] Error:`, error);
        return res.status(500).json({
            success: false,
            message: `Error triggering audit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
});

// *********************************************** Handle Endpoints ***********************************************

// default response (unknown routes)
app.get('/{*any}', (request, response) => {
    AppLogger.debug(`[*] KO:  la route demandé ${request.url} n'existe pas`);
    response.status(404).send({
        success: false,
        message: "La route demandé 'existe pas",
    });
});

// *********************************************** Server Config & Launch ***********************************************

// *********************************************** Database Connection ***********************************************
try {
    await DataBaseManager.connect();
    AppLogger.info('Database connected successfully');
} catch (error) {
    AppLogger.error('Failed to connect to database:', error);
    process.exit(1);
}

await new Promise((resolve) =>
    httpServer.listen(
        {
            port,
        },
        () => resolve(null),
    ),
);

httpServer.timeout = currentConfig?.serverTimeout;

AppLogger.info(`🚀 Server started at ${currentConfig?.serverUrl}`);

// *********************************************** Data Update Scheduler ***********************************************
DataUpdateScheduler.start();
