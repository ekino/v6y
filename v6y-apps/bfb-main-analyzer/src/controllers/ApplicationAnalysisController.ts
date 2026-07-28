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
import { validate as validateCronExpression } from 'node-cron';

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

interface ScheduleApplicationAnalysisBody {
    applicationId?: number;
    cron?: string;
    enabled?: boolean;
}

interface ScheduleApplicationAnalysisResponse {
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

        let enqueuedJob;
        try {
            enqueuedJob =
                await this.applicationAnalysisQueueService.enqueueApplicationAnalysis(
                    applicationId,
                );
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

        if (!enqueuedJob) {
            throw new InternalServerErrorException({
                success: false,
                message: 'The application analysis queue is currently unavailable.',
            });
        }

        return {
            success: true,
            message: 'Application analysis queued successfully.',
            applicationId,
        };
    }

    @Post('schedule-application-analysis.json')
    @HttpCode(200)
    async scheduleApplicationAnalysis(
        @Body() body: ScheduleApplicationAnalysisBody,
    ): Promise<ScheduleApplicationAnalysisResponse> {
        const { applicationId, cron, enabled } = body || {};

        AppLogger.debug('[ApplicationAnalysisController] Entering service: [schedule-analysis]');
        AppLogger.info(
            `[ApplicationAnalysisController] applicationId: ${applicationId}, cron: ${cron}, enabled: ${enabled}`,
        );

        if (!applicationId) {
            throw new BadRequestException({
                success: false,
                message: 'The applicationId is required to schedule the application analysis.',
            });
        }

        if (!enabled) {
            try {
                await this.applicationAnalysisQueueService.removeApplicationSchedule(applicationId);
            } catch (error) {
                AppLogger.error(
                    '[ApplicationAnalysisController] An exception occurred while removing the application analysis schedule:',
                    error,
                );
                throw new InternalServerErrorException({
                    success: false,
                    message: 'An error occurred while removing the application analysis schedule.',
                });
            }

            return {
                success: true,
                message: 'Application analysis schedule removed.',
                applicationId,
            };
        }

        if (!cron?.length || !validateCronExpression(cron)) {
            throw new BadRequestException({
                success: false,
                message:
                    'A valid cron expression is required to enable the application analysis schedule.',
            });
        }

        let upsertedScheduler;
        try {
            upsertedScheduler =
                await this.applicationAnalysisQueueService.upsertApplicationSchedule(
                    applicationId,
                    cron,
                );
        } catch (error) {
            AppLogger.error(
                '[ApplicationAnalysisController] An exception occurred while upserting the application analysis schedule:',
                error,
            );
            throw new InternalServerErrorException({
                success: false,
                message: 'An error occurred while scheduling the application analysis.',
            });
        }

        if (!upsertedScheduler) {
            throw new InternalServerErrorException({
                success: false,
                message: 'The application analysis queue is currently unavailable.',
            });
        }

        return {
            success: true,
            message: 'Application analysis schedule saved.',
            applicationId,
        };
    }
}
