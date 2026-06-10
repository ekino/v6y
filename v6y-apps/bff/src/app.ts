import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import expressStatusMonitor from 'express-status-monitor';
import 'reflect-metadata';

import { configureAuthMiddleware } from '@v6y/core-logic';

import { AppModule } from './app.module.ts';
import ServerConfig from './config/ServerConfig.ts';

export async function createApp(): Promise<NestExpressApplication> {
    const { currentConfig } = ServerConfig;
    const { monitoringPath } = currentConfig || {};

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: false,
    });

    // Passport JWT initialization — must run before GraphQL routes are mounted.
    app.use(configureAuthMiddleware());

    app.enableCors();
    app.use(expressStatusMonitor({ path: monitoringPath as string }));

    await app.init();

    return app;
}
