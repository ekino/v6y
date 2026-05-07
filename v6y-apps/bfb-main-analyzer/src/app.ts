import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import Express, { Express as ExpressApp } from 'express';
import ExpressStatusMonitor from 'express-status-monitor';

import {
    AppLogger,
    ApplicationProvider,
    AuditProvider,
    CorsOptions,
    DataBaseManager,
    DependencyProvider,
} from '@v6y/core-logic';

import ServerConfig from './config/ServerConfig.ts';
import ApplicationManager from './managers/ApplicationManager.ts';

/**
 * Creates and configures the Express application
 * @returns Configured Express app instance
 */
export function createApp(): ExpressApp {
    const app = Express();

    const { currentConfig } = ServerConfig;

    const { monitoringPath } = currentConfig || {};

    // *********************************************** Configure Server ***********************************************

    // configure cookie parser
    app.use(CookieParser());

    // configure cors
    // https://expressjs.com/en/resources/middleware/cors.html
    app.use(Cors(CorsOptions));

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
        }),
    );

    // *********************************************** Handle Endpoints ***********************************************

    // Trigger analysis for a single application
    app.post('/{*any}trigger', async (request, response) => {
        const applicationId = parseInt(request.body?.applicationId, 10);
        AppLogger.info(`[trigger] applicationId: ${applicationId}`);

        if (!applicationId) {
            response.status(400).json({ success: false, message: 'applicationId is required' });
            return;
        }

        // Respond immediately; analysis runs in background
        response.json({ success: true, applicationId });

        try {
            await DataBaseManager.connect();
            await AuditProvider.deleteAuditsByAppId(applicationId);
            await DependencyProvider.deleteDependenciesByAppId(applicationId);

            const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
                _id: applicationId,
            });

            if (application) {
                await ApplicationManager.buildApplicationReports(application);
            }
        } catch (error) {
            AppLogger.error(`[trigger] error: ${String(error)}`);
        }
    });

    // default response (unknown routes)
    app.get('/{*any}', (request, response) => {
        AppLogger.debug(`[*] KO:  la route demandé ${request.url} n'existe pas`);
        response.status(404).send({
            success: false,
            message: "La route demandé n'existe pas",
        });
    });

    return app;
}
