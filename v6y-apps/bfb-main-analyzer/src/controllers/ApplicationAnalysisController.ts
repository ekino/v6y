import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Inject,
    InternalServerErrorException,
    Optional,
    Post,
} from '@nestjs/common';

import { AppLogger } from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';
import { ApplicationAnalysisQueueService } from '../queues/ApplicationAnalysisQueueService.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.apiPath || '').toString();

interface TriggerApplicationAnalysisBody {
    applicationId?: number;
}

interface TriggerApplicationAnalysisResponse {
    success: boolean;
    message: string;
    applicationId: number;
}

@Controller(basePath)
export class ApplicationAnalysisController {
    constructor(
        @Optional()
        @Inject(ApplicationAnalysisQueueService)
        private readonly applicationAnalysisQueueService: ApplicationAnalysisQueueService,
    ) {}

    @Post('trigger-application-analysis.json')
    @HttpCode(200)
    async triggerApplicationAnalysis(
        @Body() body: TriggerApplicationAnalysisBody,
    ): Promise<TriggerApplicationAnalysisResponse> {
        const { applicationId } = body || {};

        AppLogger.debug('[ApplicationAnalysisController] Entering service: [trigger-analysis]');
        AppLogger.info(`[ApplicationAnalysisController] applicationId: ${applicationId}`);

        if (!applicationId) {
            throw new BadRequestException({
                success: false,
                message: 'The applicationId is required to trigger the application analysis.',
            });
        }

        try {
            await this.applicationAnalysisQueueService.enqueueApplicationAnalysis(applicationId);
        } catch (error) {
            AppLogger.error(
                '[ApplicationAnalysisController] An exception occurred while enqueuing the application analysis:',
                error,
            );
            throw new InternalServerErrorException({
                success: false,
                message: 'An error occurred while triggering the application analysis.',
            });
        }

        return {
            success: true,
            message: 'Application analysis queued successfully.',
            applicationId,
        };
    }
}
