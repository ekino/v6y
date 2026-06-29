import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';

import AppLogger from '../core/AppLogger.ts';

/**
 * Replaces Nest's default 404 body with the legacy Express response shape
 * used by the backend services before the NestJS migration.
 *
 * The Catch decorator is applied as a plain function call instead of
 * decorator syntax: tsx only applies the `experimentalDecorators` tsconfig
 * option of the package it is launched from, so decorator syntax in this
 * shared library would be mis-transpiled when apps import it at runtime.
 */
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

Catch(NotFoundException)(NotFoundFilter);
