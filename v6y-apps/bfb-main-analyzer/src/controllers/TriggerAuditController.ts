import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    InternalServerErrorException,
    NotFoundException,
    Post,
} from '@nestjs/common';

import TriggerAuditManager from '../managers/TriggerAuditManager.ts';

interface TriggerAuditBody {
    applicationId?: string | number;
    branch?: string;
    analysisTypes?: string[];
}

@Controller()
export class TriggerAuditController {
    @Post('trigger-audit')
    @HttpCode(200)
    async triggerAudit(@Body() body: TriggerAuditBody) {
        const result = await TriggerAuditManager.triggerAudit(body || {});

        switch (result.status) {
            case 'invalid-application':
                throw new BadRequestException({
                    success: false,
                    message: 'applicationId is required',
                });
            case 'application-not-found':
                throw new NotFoundException({
                    success: false,
                    message: 'Application not found',
                });
            case 'creation-failed':
                throw new InternalServerErrorException({
                    success: false,
                    message: 'Failed to create audit run',
                });
            case 'invalid-run-id':
                throw new InternalServerErrorException({
                    success: false,
                    message: 'Invalid audit run id',
                });
            case 'error':
                throw new InternalServerErrorException({
                    success: false,
                    message: 'Failed to trigger audit',
                });
            default:
                return {
                    success: true,
                    message: 'Audit triggered successfully',
                    auditRun: result.auditRun,
                };
        }
    }
}
