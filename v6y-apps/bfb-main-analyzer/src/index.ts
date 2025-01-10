import { AppLogger, ServerUtils } from '@v6y/core-logic';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import Express from 'express';
import ExpressStatusMonitor from 'express-status-monitor';

import ServerConfig from './config/ServerConfig.ts';
import DataUpdateScheduler from './workers/DataUpdateScheduler.ts';

const { createServer } = ServerUtils;

const { getCurrentConfig } = ServerConfig;

const { ssl, monitoringPath, hostname, port, healthCheckPath } = getCurrentConfig() || {};

const app = Express();

const httpServer = createServer({
    app,
    config: getCurrentConfig(),
});

// *********************************************** Configure Server ***********************************************

// configure cookie parser
app.use(CookieParser());

// configure cors
// https://expressjs.com/en/resources/middleware/cors.html
const corsOptions = {
    origin: function (
        origin: string | undefined,
        callback: (err: Error | null, origin?: string) => void,
    ) {
        AppLogger.debug('Redirection cors orgin : ' + origin);
        callback(null, origin);
    },
};

app.use(Cors(corsOptions));

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

// *********************************************** Handle Endpoints ***********************************************

// default response (unknown routes)
app.get('*', (request, response) => {
    AppLogger.debug(`[*] KO:  la route demandé ${request.url} n'existe pas`);
    response.status(404).send({
        success: false,
        message: "La route demandé 'existe pas",
    });
});

// *********************************************** Server Config & Launch ***********************************************

await new Promise((resolve) =>
    httpServer.listen(
        {
            port,
        },
        () => resolve(null),
    ),
);

httpServer.timeout = getCurrentConfig()?.serverTimeout;

AppLogger.info(`🚀 Server started at ${getCurrentConfig()?.serverUrl}`);

// *********************************************** Data Update Scheduler ***********************************************
DataUpdateScheduler.start();
