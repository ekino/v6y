import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { AppLogger, DataBaseManager, ServerUtils, configureAuthMiddleware } from '@v6y/core-logic';

import { createApp } from './app.ts';
import ServerConfig from './config/ServerConfig.ts';
import VitalityResolvers from './resolvers/VitalityResolvers.ts';
import { buildUserMiddleware } from './resolvers/manager/AuthenticationManager.ts';
import VitalityTypes from './types/VitalityTypes.ts';

const { createServer } = ServerUtils;

const { currentConfig } = ServerConfig;

const { apiPath } = currentConfig || {};

// *********************************************** App & HTTP Server Creation ***********************************************

const app = createApp();

app.use(configureAuthMiddleware());

const httpServer = createServer({
    app,
    config: currentConfig,
});

// *********************************************** Graphql Config & Endpoints ***********************************************

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.use(...buildUserMiddleware(server, apiPath as string));

// *********************************************** DataBase Config & Launch ***********************************************

await DataBaseManager.connect();

// *********************************************** Server Config & Launch ***********************************************

await new Promise((resolve) =>
    httpServer.listen(
        {
            port: currentConfig?.port,
        },
        () => resolve(null),
    ),
);

httpServer.timeout = currentConfig?.serverTimeout as number; // milliseconds

AppLogger.info(`🚀 Server started at ${currentConfig?.serverUrl}`);
