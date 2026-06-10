import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { AppLogger } from '@v6y/core-logic';

import StaticAuditorManager from '../auditors/StaticAuditorManager.ts';
import ServerConfig from '../commons/ServerConfig.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.staticAuditorApiPath || '').toString();

interface StartStaticAuditorBody {
    applicationId?: number;
    workspaceFolder?: string;
}

@Controller(basePath)
export class StaticAuditorController {
    @Post('start-static-auditor.json')
    @HttpCode(200)
    async startStaticAudit(
        @Body() body: StartStaticAuditorBody,
        @Res() response: Response,
    ): Promise<void> {
        try {
            AppLogger.debug('[StaticAuditorRouter] Entering service: [start-static-auditor]');

            const { applicationId, workspaceFolder } = body || {};

            // ********************************************** Start Audits ***********************************************
            const auditsStartedSuccessfully = await StaticAuditorManager.startStaticAudit({
                applicationId,
                workspaceFolder,
            }); // Wait for audits to potentially complete

            // ********************************************** Server Response ***********************************************
            if (auditsStartedSuccessfully) {
                response.status(200).json({
                    success: true,
                    message: 'Static Code Audits have end successfully!',
                });
            } else {
                response.status(500).json({
                    success: false,
                    message: 'An error occurred while starting the Static Code Audits.',
                });
            }
        } catch (error) {
            AppLogger.error(
                '[StaticAuditorRouter] An exception occurred during the Static Code Audits:',
                error,
            );
            response.status(500).json({
                success: false,
                message: 'An error occurred during the Static Code Audits.',
            });
        }
    }
}
