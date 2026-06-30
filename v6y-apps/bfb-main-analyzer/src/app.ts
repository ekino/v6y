import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { Application as ExpressApplication, Request, Response } from 'express';
import expressStatusMonitor from 'express-status-monitor';
import 'reflect-metadata';

import { AppLogger, CorsOptions, NestAppLogger, NotFoundFilter } from '@v6y/core-logic';

import { AppModule } from './app.module.ts';
import ServerConfig from './config/ServerConfig.ts';

export async function createApp(): Promise<NestExpressApplication> {
    const { currentConfig } = ServerConfig;
    const { monitoringPath } = currentConfig || {};

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: new NestAppLogger(),
    });

    app.use(cookieParser());
    app.enableCors(CorsOptions);
    app.use(expressStatusMonitor({ path: monitoringPath as string }));
    const expressApp = app.getHttpAdapter().getInstance() as ExpressApplication;

    // The manual audit trigger endpoint (POST /trigger-audit) is handled by
    // TriggerAuditController, registered in AppModule.

    app.useGlobalFilters(new NotFoundFilter());

    await app.init();

    // *********************************************** Handle Endpoints ***********************************************

    // Register fallback route after Nest initialization so framework routes (e.g. /health) are not shadowed.
    expressApp.get('/{*any}', (request: Request, response: Response) => {
        AppLogger.debug(`[*] KO: requested route does not exist: ${request.url}`);
        response.status(404).send({
            success: false,
            message: 'The requested route does not exist',
        });
    });

    return app;
}
