import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { AppLogger, DataBaseManager, ServerUtils } from '@v6y/commons';
import BodyParser from 'body-parser';
import Cors from 'cors';
import Express from 'express';
import ExpressStatusMonitor from 'express-status-monitor';

import ServerConfig from './config/ServerConfig.js';
import VitalityResolvers from './resolvers/VitalityResolvers.js';
import VitalityTypes from './types/VitalityTypes.js';


const { createServer } = ServerUtils;

const { getCurrentConfig } = ServerConfig;

const { ssl, monitoringPath, hostname, port, apiPath, healthCheckPath } = getCurrentConfig() || {};

const app = Express();

// *********************************************** Monitoring Endpoints ***********************************************

app.use(
    ExpressStatusMonitor({
        path: monitoringPath as string,
        healthChecks: [
            {
                protocol: ssl ? 'https' : 'http',
                host: hostname as string,
                port: port as string,
                path: healthCheckPath as string,
            },
        ],
    }),
);

// *********************************************** Graphql Config & Endpoints ***********************************************

const httpServer = createServer({
    app,
    config: getCurrentConfig(),
});

const server = new ApolloServer({
    typeDefs: VitalityTypes,
    resolvers: VitalityResolvers,
    plugins: [
        ApolloServerPluginDrainHttpServer({
            httpServer,
        }),
    ],
});

await server.start();

app.use(
    apiPath as string,
    Cors(),
    BodyParser.json(),
    expressMiddleware(server, {
        context: async ({ req }) => ({
            token: req.headers.token,
        }),
    }),
);

// *********************************************** Health Check Endpoints ***********************************************

app.get(healthCheckPath as string, (req, res) => {
    res.status(200).send('V6y Sever is UP !');
});

// *********************************************** DataBase Config & Launch ***********************************************

await DataBaseManager.connect();

// *********************************************** Server Config & Launch ***********************************************

await new Promise((resolve) =>
    httpServer.listen(
        {
            port,
        },
        () => resolve(null),
    ),
);

httpServer.timeout = getCurrentConfig()?.serverTimeout as number; // milliseconds

AppLogger.info(`🚀 Server started at ${getCurrentConfig()?.serverUrl}`);
