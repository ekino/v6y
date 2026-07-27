import { Body, Controller, HttpCode, InternalServerErrorException, Post } from '@nestjs/common';

import { AppLogger } from '@v6y/core-logic';

import { AuditOutcome } from '../auditors/types/AuditCommonsType.ts';
import ServerConfig from '../commons/ServerConfig.ts';
import { StaticAnalysisQueueService } from '../queues/StaticAnalysisQueueService.ts';

const { currentConfig } = ServerConfig;
const basePath = (currentConfig?.staticAuditorApiPath || '').toString();

interface StartStaticAuditorBody {
    applicationId?: number;
    workspaceFolder?: string;
    auditRunId?: string;
}

interface StartStaticAuditorResponse {
    success: boolean;
    skipped: boolean;
    message: string;
}

@Controller(basePath)
export class StaticAuditorController {
    constructor(private readonly staticAnalysisQueueService: StaticAnalysisQueueService) {}

    @Post('start-static-auditor.json')
    @HttpCode(200)
    async startStaticAudit(
        @Body() body: StartStaticAuditorBody,
    ): Promise<StartStaticAuditorResponse> {
        AppLogger.debug('[StaticAuditorController] Entering service: [start-static-auditor]');

        const { applicationId, workspaceFolder, auditRunId } = body || {};

        let outcome: AuditOutcome | null;
        try {
            outcome = await this.staticAnalysisQueueService.runStaticAnalysis({
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

        if (!outcome) {
            throw new InternalServerErrorException({
                success: false,
                message: 'The static code analysis queue is currently unavailable.',
            });
        }

        if (outcome.status === 'failed') {
            throw new InternalServerErrorException({
                success: false,
                message:
                    outcome.message || 'An error occurred while starting the Static Code Audits.',
            });
        }

        return {
            success: true,
            skipped: outcome.status === 'skipped',
            message: outcome.message || 'Static Code Audits have end successfully!',
        };
    }
}
