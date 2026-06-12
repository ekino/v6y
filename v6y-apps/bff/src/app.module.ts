import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { print } from 'graphql';

import { HealthController, validateCredentials } from '@v6y/core-logic';

import ServerConfig from './config/ServerConfig.ts';
import { AccountResolver } from './resolvers/account/AccountResolver.ts';
import { ApplicationResolver } from './resolvers/application/ApplicationResolver.ts';
import { AuditHelpResolver } from './resolvers/audit/AuditHelpResolver.ts';
import { DeprecatedDependencyResolver } from './resolvers/dependency/deprecated-status/DeprecatedDependencyResolver.ts';
import { DependencyStatusHelpResolver } from './resolvers/dependency/status-help/DependencyStatusHelpResolver.ts';
import { EvolutionHelpResolver } from './resolvers/evolutions/EvolutionHelpResolver.ts';
import { FaqResolver } from './resolvers/faq/FaqResolver.ts';
import { NotificationsResolver } from './resolvers/notifications/NotificationsResolver.ts';
import VitalityTypes from './types/VitalityTypes.ts';

const { currentConfig } = ServerConfig;
const { apiPath } = currentConfig || {};

// `@nestjs/graphql` v13 interpolates the `typeDefs` value into a
// template literal before re-parsing it via `graphql-tag`, so a
// DocumentNode would be stringified as `[object Object]`. We must
// serialize the schema back to its SDL form first.
const typeDefsSdl = print(VitalityTypes);

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            typeDefs: typeDefsSdl,
            path: apiPath as string,
            // Preserve the legacy authentication context behavior previously
            // implemented in resolvers/manager/AuthenticationManager.ts.
            context: async ({
                req,
            }: {
                req: Express.Request & { body?: { operationName?: string } };
            }) => {
                if (
                    req.body?.operationName !== 'LoginAccount' &&
                    req.body?.operationName !== 'IntrospectionQuery'
                ) {
                    const user = await validateCredentials(req);
                    if (!user) {
                        throw new Error('Unauthorized User');
                    }
                    return { user };
                }
                return {};
            },
        }),
    ],
    controllers: [HealthController],
    providers: [
        AccountResolver,
        ApplicationResolver,
        AuditHelpResolver,
        DeprecatedDependencyResolver,
        DependencyStatusHelpResolver,
        EvolutionHelpResolver,
        FaqResolver,
        NotificationsResolver,
    ],
})
export class AppModule {}
