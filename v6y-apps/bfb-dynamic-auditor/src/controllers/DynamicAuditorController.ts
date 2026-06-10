import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { AppLogger } from '@v6y/core-logic';

import DynamicAuditorManager from '../auditors/DynamicAuditorManager.ts';
import ServerConfig from '../commons/ServerConfig.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.dynamicAuditorApiPath || '').toString();

interface StartDynamicAuditorBody {
    applicationId?: number;
}

@Controller(basePath)
export class DynamicAuditorController {
    @Post('start-dynamic-auditor.json')
    @HttpCode(200)
    async startDynamicAudit(
        @Body() body: StartDynamicAuditorBody,
        @Res() response: Response,
    ): Promise<void> {
        try {
            AppLogger.debug('[DynamicAuditorApiPath] Entering service: [start-dynamic-auditor]');

            const { applicationId } = body || {};

            // ********************************************** Start Audits ***********************************************
            const auditsStartedSuccessfully = await DynamicAuditorManager.startDynamicAudit({
                applicationId,
            }); // Wait for audits to potentially complete

            // ********************************************** Server Response ***********************************************
            if (auditsStartedSuccessfully) {
                response.status(200).json({
                    success: true,
                    message: 'Dynamic Audits have end successfully!',
                });
            } else {
                response.status(500).json({
                    success: false,
                    message: 'An error occurred while starting the Dynamic Audits.',
                });
            }
        } catch (error) {
            AppLogger.error(
                '[DynamicAuditorApiPath] An exception occurred during the Dynamic Audits:',
                error,
            );
            response.status(500).json({
                success: false,
                message: 'An error occurred during the Dynamic Audits.',
            });
        }
    }
}
