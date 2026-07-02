import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    InternalServerErrorException,
    Post,
} from '@nestjs/common';

import { AppLogger } from '@v6y/core-logic';

import DevOpsAuditorManager from '../auditors/DevOpsAuditorManager.ts';
import ServerConfig from '../commons/ServerConfig.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.devopsAuditorApiPath || '').toString();

interface StartDevOpsAuditorBody {
    applicationId?: number;
    auditRunId?: string;
}

interface StartDevOpsAuditorResponse {
    success: boolean;
    message: string;
}

@Controller(basePath)
export class DevOpsAuditorController {
    @Post('start-devops-auditor.json')
    @HttpCode(200)
    async startDevOpsAudit(
        @Body() body: StartDevOpsAuditorBody,
    ): Promise<StartDevOpsAuditorResponse> {
        AppLogger.debug('[DevOpsAuditorController] Entering service: [start-devops-auditor]');

        const { applicationId, auditRunId } = body || {};
        AppLogger.info(`[DevOpsAuditorController] applicationId: ${applicationId}`);

        if (!applicationId) {
            AppLogger.error(
                '[DevOpsAuditorController] The applicationId is required to start the DevOps Audits.',
            );
            throw new BadRequestException({
                success: false,
                message: 'The applicationId is required to start the DevOps Audits.',
            });
        }

        let auditsStartedSuccessfully: boolean;
        try {
            auditsStartedSuccessfully = await DevOpsAuditorManager.startDevOpsAudit({
                applicationId,
                auditRunId,
            });
        } catch (error) {
            AppLogger.error(
                '[DevOpsAuditorController] An exception occurred during the DevOps Audits:',
                error,
            );
            throw new InternalServerErrorException({
                success: false,
                message: 'An error occurred during the DevOps Audits.',
            });
        }

        if (!auditsStartedSuccessfully) {
            throw new InternalServerErrorException({
                success: false,
                message: 'An error occurred while starting the DevOps Audits.',
            });
        }

        return {
            success: true,
            message: 'DevOps Audits have end successfully!',
        };
    }
}
