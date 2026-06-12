import type { LoggerService } from '@nestjs/common';

import AppLogger from '../core/AppLogger.ts';

const formatMessage = (message: unknown, optionalParams: unknown[]): string => {
    const context = optionalParams.length ? ` [${optionalParams.join('] [')}]` : '';
    return `${typeof message === 'object' ? JSON.stringify(message) : String(message)}${context}`;
};

/**
 * Bridges the NestJS framework logger to the shared winston AppLogger,
 * so framework errors (DI failures, unhandled exceptions) are not swallowed.
 */
export class NestAppLogger implements LoggerService {
    log(message: unknown, ...optionalParams: unknown[]): void {
        AppLogger.info(formatMessage(message, optionalParams));
    }

    error(message: unknown, ...optionalParams: unknown[]): void {
        AppLogger.error(formatMessage(message, optionalParams));
    }

    warn(message: unknown, ...optionalParams: unknown[]): void {
        AppLogger.warn(formatMessage(message, optionalParams));
    }

    debug(message: unknown, ...optionalParams: unknown[]): void {
        AppLogger.debug(formatMessage(message, optionalParams));
    }

    verbose(message: unknown, ...optionalParams: unknown[]): void {
        AppLogger.verbose(formatMessage(message, optionalParams));
    }

    fatal(message: unknown, ...optionalParams: unknown[]): void {
        AppLogger.error(formatMessage(message, optionalParams));
    }
}
