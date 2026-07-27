import {
    BadRequestException,
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
import { DevOpsAnalysisQueueService } from '../queues/DevOpsAnalysisQueueService.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.devopsAuditorApiPath || '').toString();

interface StartDevOpsAuditorBody {
    applicationId?: number;
    auditRunId?: string;
}

interface StartDevOpsAuditorResponse {
    success: boolean;
    skipped: boolean;
    message: string;
}

@Controller(basePath)
export class DevOpsAuditorController {
    constructor(
        // Explicit token: the esbuild-based test transform does not emit
        // design:paramtypes, so relying on inferred metadata would inject undefined.
        @Inject(DevOpsAnalysisQueueService)
        private readonly devOpsAnalysisQueueService: DevOpsAnalysisQueueService,
    ) {}

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

        let outcome: AuditOutcome | null;
        try {
            outcome = await this.devOpsAnalysisQueueService.runDevOpsAnalysis({
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

        if (!outcome) {
            throw new InternalServerErrorException({
                success: false,
                message: 'The DevOps analysis queue is currently unavailable.',
            });
        }

        if (outcome.status === 'failed') {
            throw new InternalServerErrorException({
                success: false,
                message: outcome.message || 'An error occurred while starting the DevOps Audits.',
            });
        }

        // A skipped audit is reported as a success with `skipped: true` rather than an
        // error: DORA metrics are GitLab-only, so having nothing to audit must not fail
        // the caller's audit run, but it still has to be visible in the response.
        return {
            success: true,
            skipped: outcome.status === 'skipped',
            message: outcome.message || 'DevOps Audits have end successfully!',
        };
    }
}
