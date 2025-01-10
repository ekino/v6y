import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { validateCredentials } from '@v6y/core-logic';
import BodyParser from 'body-parser';
import Cors from 'cors';
import { RequestHandler } from 'express';

export function buildUserMiddleware(
    server: ApolloServer,
    apiPath: string,
): [string, RequestHandler, RequestHandler, RequestHandler] {
    return [
        apiPath as string,
        Cors(),
        BodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                if (
                    req.body?.operationName !== 'LoginAccount' &&
                    req.body?.operationName !== 'IntrospectionQuery'
                ) {
                    const user = await validateCredentials(req);
                    if (!user) {
                        throw new Error('Unauthorized');
                    }
                    return { user };
                }
                return {};
            },
        }),
    ];
}
