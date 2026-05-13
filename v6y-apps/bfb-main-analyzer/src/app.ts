import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import expressStatusMonitor from 'express-status-monitor';
import { Application as ExpressApplication, Request, Response } from 'express';
import 'reflect-metadata';

import {
    AppLogger,
    ApplicationProvider,
    AuditRunProvider,
    CorsOptions,
    NestAppLogger,
    NotFoundFilter,
} from '@v6y/core-logic';

import { AppModule } from './app.module.ts';
import ServerConfig from './config/ServerConfig.ts';
import { buildDynamicReports, buildStaticReports } from './managers/AuditManager.ts';

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

    // *********************************************** Trigger Manual Audit Endpoint ***********************************************

    expressApp.post('/trigger-audit', async (request: Request, response: Response) => {
        try {
            const { applicationId, branch, analysisTypes } = (request.body || {}) as {
                applicationId?: string | number;
                branch?: string;
                analysisTypes?: string[];
            };

            const numericApplicationId = Number(applicationId);

            AppLogger.info(
                `[MainAnalyzerApp - triggerAudit] applicationId: ${applicationId}, branch: ${branch}, analysisTypes: ${analysisTypes?.join(',')}`,
            );

            if (!Number.isInteger(numericApplicationId)) {
                response.status(400).json({
                    success: false,
                    message: 'applicationId is required',
                });
                return;
            }

            const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
                _id: numericApplicationId,
            });

            if (!application?._id) {
                response.status(404).json({
                    success: false,
                    message: 'Application not found',
                });
                return;
            }

            const auditRun = await AuditRunProvider.createAuditRun({
                appId: numericApplicationId,
                branch: branch || undefined,
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

            const auditRunId = Number(auditRun._id);

            if (!Number.isInteger(auditRunId)) {
                response.status(500).json({
                    success: false,
                    message: 'Invalid audit run id',
                });
                return;
            }

            const applicationForAnalysis = application as unknown as {
                _id: number;
                repo?: { allBranches?: string[] };
            };

            await AuditRunProvider.updateAuditRunStatus({
                auditRunId,
                runStatus: 'in_progress',
            });

            (async () => {
                try {
                    const branchesToAnalyze = branch
                        ? [{ name: branch }]
                        : applicationForAnalysis?.repo?.allBranches?.map((b: string) => ({
                              name: b,
                          })) || [];

                    if (analysisTypes?.includes('static') || !analysisTypes) {
                        AppLogger.info(
                            `[MainAnalyzerApp - triggerAudit] Triggering static auditor for app ${applicationId}`,
                        );
                        await buildStaticReports({
                            application: applicationForAnalysis,
                            branches: branchesToAnalyze,
                            auditRunId: String(auditRunId),
                        });
                    }

                    if (analysisTypes?.includes('dynamic') || !analysisTypes) {
                        AppLogger.info(
                            `[MainAnalyzerApp - triggerAudit] Triggering dynamic auditor for app ${applicationId}`,
                        );
                        await buildDynamicReports({
                            application: applicationForAnalysis,
                            auditRunId: String(auditRunId),
                        });
                    }

                    await AuditRunProvider.updateAuditRunStatus({
                        auditRunId,
                        runStatus: 'completed',
                        completedAt: new Date(),
                    });

                    AppLogger.info(`[MainAnalyzerApp - triggerAudit] AuditRun completed: ${auditRunId}`);
                } catch (asyncError) {
                    AppLogger.error(`[MainAnalyzerApp - triggerAudit] Async audit error: ${asyncError}`);
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
        } catch (error: unknown) {
            AppLogger.error('[MainAnalyzerApp - triggerAudit] error: ', error);
            response.status(500).json({
                success: false,
                message: 'Failed to trigger audit',
            });
        }
    });

    // *********************************************** Handle Endpoints ***********************************************

    expressApp.get('/{*any}', (request: Request, response: Response) => {
        AppLogger.debug(`[*] KO:  la route demandé ${request.url} n'existe pas`);
        response.status(404).send({
            success: false,
            message: "La route demandé n'existe pas",
        });
    });

    app.useGlobalFilters(new NotFoundFilter());

    await app.init();

    return app;
}
