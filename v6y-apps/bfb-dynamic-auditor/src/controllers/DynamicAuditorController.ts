import {
    Body,
    Controller,
    HttpCode,
    Inject,
    InternalServerErrorException,
    Post,
} from '@nestjs/common';

import { AppLogger } from '@v6y/core-logic';

import { AuditOutcome } from '../auditors/types/AuditCommonsType.ts';
import ServerConfig from '../commons/ServerConfig.ts';
import { DynamicAnalysisQueueService } from '../queues/DynamicAnalysisQueueService.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.dynamicAuditorApiPath || '').toString();

interface StartDynamicAuditorBody {
    applicationId?: number;
    auditRunId?: string;
}

interface StartDynamicAuditorResponse {
    success: boolean;
    skipped: boolean;
    message: string;
}

@Controller(basePath)
export class DynamicAuditorController {
    constructor(
        // Explicit token: the esbuild-based test transform does not emit
        // design:paramtypes, so relying on inferred metadata would inject undefined.
        @Inject(DynamicAnalysisQueueService)
        private readonly dynamicAnalysisQueueService: DynamicAnalysisQueueService,
    ) {}

    @Post('start-dynamic-auditor.json')
    @HttpCode(200)
    async startDynamicAudit(
        @Body() body: StartDynamicAuditorBody,
    ): Promise<StartDynamicAuditorResponse> {
        AppLogger.debug('[DynamicAuditorController] Entering service: [start-dynamic-auditor]');

        const { applicationId, auditRunId } = body || {};

        let outcome: AuditOutcome | null;
        try {
            outcome = await this.dynamicAnalysisQueueService.runDynamicAnalysis({
                applicationId,
                auditRunId,
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

        if (!outcome) {
            throw new InternalServerErrorException({
                success: false,
                message: 'The dynamic analysis queue is currently unavailable.',
            });
        }

        if (outcome.status === 'failed') {
            throw new InternalServerErrorException({
                success: false,
                message: outcome.message || 'An error occurred while starting the Dynamic Audits.',
            });
        }

        return {
            success: true,
            skipped: outcome.status === 'skipped',
            message: outcome.message || 'Dynamic Audits have end successfully!',
        };
    }
}
