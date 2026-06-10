import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import expressStatusMonitor from 'express-status-monitor';
import 'reflect-metadata';

import { CorsOptions } from '@v6y/core-logic';

import { AppModule } from './app.module.ts';
import ServerConfig from './config/ServerConfig.ts';
import { NotFoundFilter } from './filters/NotFoundFilter.ts';

export async function createApp(): Promise<NestExpressApplication> {
    const { currentConfig } = ServerConfig;
    const { monitoringPath } = currentConfig || {};

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: false,
    });

    app.use(cookieParser());
    app.enableCors(CorsOptions);
    app.use(expressStatusMonitor({ path: monitoringPath as string }));

    app.useGlobalFilters(new NotFoundFilter());

    await app.init();

    return app;
}
