import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { AppLogger, DataBaseManager, ServerUtils, configureAuthMiddleware } from '@v6y/core-logic';

import ServerConfig from './config/ServerConfig.ts';
import { createApp } from './createApp.ts';
import VitalityResolvers from './resolvers/VitalityResolvers.ts';
import { buildUserMiddleware } from './resolvers/manager/AuthenticationManager.ts';
import VitalityTypes from './types/VitalityTypes.ts';

const { createServer } = ServerUtils;

const { currentConfig } = ServerConfig;

const { port, apiPath } = currentConfig || {};

const app = createApp();

app.use(configureAuthMiddleware());

const httpServer = createServer({
    app,
    config: currentConfig,
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.use(...buildUserMiddleware(server, apiPath as string));

await DataBaseManager.connect();

await new Promise((resolve) =>
    httpServer.listen(
        {
            port,
        },
        () => resolve(null),
    ),
);

httpServer.timeout = currentConfig?.serverTimeout as number;

AppLogger.info(`🚀 Server started at ${currentConfig?.serverUrl}`);
