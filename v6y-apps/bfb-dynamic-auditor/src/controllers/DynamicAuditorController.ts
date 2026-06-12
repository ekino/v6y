import {
    Body,
    Controller,
    HttpCode,
    InternalServerErrorException,
    Post,
} from '@nestjs/common';

import { AppLogger } from '@v6y/core-logic';

import DynamicAuditorManager from '../auditors/DynamicAuditorManager.ts';
import ServerConfig from '../commons/ServerConfig.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.dynamicAuditorApiPath || '').toString();

interface StartDynamicAuditorBody {
    applicationId?: number;
}

interface StartDynamicAuditorResponse {
    success: boolean;
    message: string;
}

@Controller(basePath)
export class DynamicAuditorController {
    @Post('start-dynamic-auditor.json')
    @HttpCode(200)
    async startDynamicAudit(
        @Body() body: StartDynamicAuditorBody,
    ): Promise<StartDynamicAuditorResponse> {
        AppLogger.debug('[DynamicAuditorController] Entering service: [start-dynamic-auditor]');

        const { applicationId } = body || {};

        let auditsStartedSuccessfully: boolean;
        try {
            auditsStartedSuccessfully = await DynamicAuditorManager.startDynamicAudit({
                applicationId,
            });
        } catch (error) {
            AppLogger.error(
                '[DynamicAuditorController] An exception occurred during the Dynamic Audits:',
                error,
            );
            throw new InternalServerErrorException({
                success: false,
                message: 'An error occurred during the Dynamic Audits.',
            });
        }

        if (!auditsStartedSuccessfully) {
            throw new InternalServerErrorException({
                success: false,
                message: 'An error occurred while starting the Dynamic Audits.',
            });
        }

        return {
            success: true,
            message: 'Dynamic Audits have end successfully!',
        };
    }
}
