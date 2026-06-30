import { Body, Controller, HttpCode, InternalServerErrorException, Post } from '@nestjs/common';

import { AppLogger } from '@v6y/core-logic';

import StaticAuditorManager from '../auditors/StaticAuditorManager.ts';
import ServerConfig from '../commons/ServerConfig.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.staticAuditorApiPath || '').toString();

interface StartStaticAuditorBody {
    applicationId?: number;
    workspaceFolder?: string;
    auditRunId?: string;
}

interface StartStaticAuditorResponse {
    success: boolean;
    message: string;
}

@Controller(basePath)
export class StaticAuditorController {
    @Post('start-static-auditor.json')
    @HttpCode(200)
    async startStaticAudit(
        @Body() body: StartStaticAuditorBody,
    ): Promise<StartStaticAuditorResponse> {
        AppLogger.debug('[StaticAuditorController] Entering service: [start-static-auditor]');

        const { applicationId, workspaceFolder, auditRunId } = body || {};

        let auditsStartedSuccessfully: boolean;
        try {
            auditsStartedSuccessfully = await StaticAuditorManager.startStaticAudit({
                applicationId,
                workspaceFolder,
                auditRunId,
            });
        } catch (error) {
            AppLogger.error(
                '[StaticAuditorController] An exception occurred during the Static Code Audits:',
                error,
            );
            throw new InternalServerErrorException({
                success: false,
                message: 'An error occurred during the Static Code Audits.',
            });
        }

        if (!auditsStartedSuccessfully) {
            throw new InternalServerErrorException({
                success: false,
                message: 'An error occurred while starting the Static Code Audits.',
            });
        }

        return {
            success: true,
            message: 'Static Code Audits have end successfully!',
        };
    }
}
