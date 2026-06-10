import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AppLogger } from '@v6y/core-logic';

/**
 * Replaces Nest's default 404 body with the legacy Express response shape
 * used by the bfb-devops-auditor service before the NestJS migration.
 */
@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
    catch(_exception: NotFoundException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        AppLogger.debug(`[*] KO: Requested route ${request.url} does not exist`);
        response.status(404).json({
            success: false,
            message: 'The requested route does not exist',
        });
    }
}
