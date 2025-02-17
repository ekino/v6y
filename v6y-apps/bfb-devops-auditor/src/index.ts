import { AppLogger, CorsOptions, ServerUtils } from '@v6y/core-logic';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressStatusMonitor from 'express-status-monitor';

import ServerConfig from './commons/ServerConfig.ts';
import DevOpsAuditorRouter from './routes/DevOpsAuditorRouter.ts';

const { createServer } = ServerUtils;
const { currentConfig } = ServerConfig;

const {
    ssl,
    monitoringPath,
    hostname,
    port,
    healthCheckPath,
    devopsAuditorApiPath,
    serverTimeout,
    serverUrl,
} = currentConfig || {}; // Destructuring with defaults

const app = express();

const httpServer = createServer({
    app,
    config: currentConfig,
});

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

// *********************************************** Health Check ***********************************************

// Health Check Endpoint: Responds with "V6y Server is UP!" if the server is healthy.
app.get(healthCheckPath, (req, res) => {
    res.status(200).send('V6y Server is UP!');
});

// *********************************************** App Auditor Routes ***********************************************
app.use(devopsAuditorApiPath || '', DevOpsAuditorRouter);

// *********************************************** Default Route (404) ***********************************************

// Default Route: Handles requests to unknown routes and returns a 404 Not Found response.
app.get('*', (request, response) => {
    AppLogger.debug(`[*] KO: Requested route ${request.url} does not exist`);
    response.status(404).json({
        success: false,
        message: 'The requested route does not exist',
    });
});

// *********************************************** Server Start ***********************************************

await new Promise((resolve) => httpServer.listen({ port }, () => resolve(null))); // Wait for server to start

httpServer.timeout = serverTimeout; // Set server timeout

AppLogger.info(`🚀 Server started at ${serverUrl}`);
