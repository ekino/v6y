import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { AppLogger } from '@v6y/core-logic';

import DevOpsAuditorManager from '../auditors/DevOpsAuditorManager.ts';
import ServerConfig from '../commons/ServerConfig.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.devopsAuditorApiPath || '').toString();

interface StartDevOpsAuditorBody {
    applicationId?: number;
}

@Controller(basePath)
export class DevOpsAuditorController {
    @Post('start-devops-auditor.json')
    @HttpCode(200)
    async startDevOpsAudit(
        @Body() body: StartDevOpsAuditorBody,
        @Res() response: Response,
    ): Promise<void> {
        try {
            AppLogger.debug('[DevOpsAuditorRouter] Entering service: [start-devops-auditor]');

            const { applicationId } = body || {};

            // ********************************************** Input Validation ***********************************************
            AppLogger.info(`[DevOpsAuditorRouter] applicationId: ${applicationId}`);

            if (!applicationId) {
                AppLogger.error(
                    '[DevOpsAuditorRouter] The applicationId is required to start the DevOps Audits.',
                );
                response.status(400).json({
                    success: false,
                    message: 'The applicationId is required to start the DevOps Audits.',
                });
                return;
            }

            // ********************************************** Start Audits ***********************************************
            const auditsStartedSuccessfully = await DevOpsAuditorManager.startDevOpsAudit({
                applicationId,
            }); // Wait for audits to potentially complete

            // ********************************************** Server Response ***********************************************
            if (auditsStartedSuccessfully) {
                response.status(200).json({
                    success: true,
                    message: 'DevOps Audits have end successfully!',
                });
            } else {
                response.status(500).json({
                    success: false,
                    message: 'An error occurred while starting the DevOps Audits.',
                });
            }
        } catch (error) {
            AppLogger.error(
                '[DevOpsAuditorRouter] An exception occurred during the DevOps Audits:',
                error,
            );
            response.status(500).json({
                success: false,
                message: 'An error occurred during the DevOps Audits.',
            });
        }
    }
}
