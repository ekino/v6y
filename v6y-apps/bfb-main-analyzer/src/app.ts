import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import Express, { Express as ExpressApp } from 'express';
import ExpressStatusMonitor from 'express-status-monitor';

import { AppLogger, ApplicationProvider, AuditRunProvider, CorsOptions } from '@v6y/core-logic';

import ServerConfig from './config/ServerConfig.ts';
import { buildDynamicReports, buildStaticReports } from './managers/AuditManager.ts';

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

    // *********************************************** Trigger Manual Audit Endpoint ***********************************************

    app.post('/trigger-audit', async (request, response) => {
        try {
            const { applicationId, branch, analysisTypes } = request.body || {};

            AppLogger.info(
                `[MainAnalyzerApp - triggerAudit] applicationId: ${applicationId}, branch: ${branch}, analysisTypes: ${analysisTypes?.join(',')}`,
            );

            if (!applicationId) {
                response.status(400).json({
                    success: false,
                    message: 'applicationId is required',
                });
                return;
            }

            // Get application details
            const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
                _id: applicationId,
            });

            if (!application?._id) {
                response.status(404).json({
                    success: false,
                    message: 'Application not found',
                });
                return;
            }

            // Create AuditRun record
            const auditRun = await AuditRunProvider.createAuditRun({
                appId: applicationId,
                branch: branch || null,
                runStatus: 'pending',
                analysisTypes: analysisTypes || ['static', 'dynamic', 'devops'],
            });

            if (!auditRun?._id) {
                response.status(500).json({
                    success: false,
                    message: 'Failed to create audit run',
                });
                return;
            }

            const auditRunId = String(auditRun._id);

            // Update status to in_progress
            await AuditRunProvider.updateAuditRunStatus({
                auditRunId,
                runStatus: 'in_progress',
            });

            // Trigger audits asynchronously
            (async () => {
                try {
                    const branchesToAnalyze = branch
                        ? [{ name: branch }]
                        : application?.repo?.allBranches?.map((b: string) => ({ name: b })) || [];

                    // Trigger static auditor if included
                    if (analysisTypes?.includes('static') || !analysisTypes) {
                        AppLogger.info(
                            `[MainAnalyzerApp - triggerAudit] Triggering static auditor for app ${applicationId}`,
                        );
                        await buildStaticReports({
                            application,
                            branches: branchesToAnalyze,
                            auditRunId,
                        });
                    }

                    // Trigger dynamic auditor if included
                    if (analysisTypes?.includes('dynamic') || !analysisTypes) {
                        AppLogger.info(
                            `[MainAnalyzerApp - triggerAudit] Triggering dynamic auditor for app ${applicationId}`,
                        );
                        await buildDynamicReports({
                            application,
                            auditRunId,
                        });
                    }

                    // Update AuditRun status to completed
                    await AuditRunProvider.updateAuditRunStatus({
                        auditRunId,
                        runStatus: 'completed',
                        completedAt: new Date(),
                    });

                    AppLogger.info(
                        `[MainAnalyzerApp - triggerAudit] AuditRun completed: ${auditRunId}`,
                    );
                } catch (asyncError) {
                    AppLogger.error(
                        `[MainAnalyzerApp - triggerAudit] Async audit error: ${asyncError}`,
                    );
                    await AuditRunProvider.updateAuditRunStatus({
                        auditRunId,
                        runStatus: 'error',
                        errorMessage: String(asyncError),
                    }).catch((err) =>
                        AppLogger.warn(
                            `[MainAnalyzerApp - triggerAudit] Failed to update error status: ${err}`,
                        ),
                    );
                }
            })();

            response.status(200).json({
                success: true,
                message: 'Audit triggered successfully',
                auditRun,
            });
        } catch (error) {
            AppLogger.error('[MainAnalyzerApp - triggerAudit] error: ', error);
            response.status(500).json({
                success: false,
                message: 'Failed to trigger audit',
            });
        }
    });

    // *********************************************** Handle Endpoints ***********************************************

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
