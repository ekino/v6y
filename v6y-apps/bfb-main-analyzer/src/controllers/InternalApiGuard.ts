import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';

import { AppLogger } from '@v6y/core-logic';

const INTERNAL_API_SECRET_HEADER = 'x-v6y-internal-secret';

const isSecretMatching = (provided: string, expected: string) => {
    const providedBuffer = Buffer.from(provided);
    const expectedBuffer = Buffer.from(expected);

    // timingSafeEqual throws on a length mismatch, which would leak the expected
    // length through the error path.
    return (
        providedBuffer.length === expectedBuffer.length &&
        timingSafeEqual(providedBuffer, expectedBuffer)
    );
};

/**
 * Shared-secret check for the endpoints only ever called by the BFF (triggering
 * and scheduling an application analysis). These are published on the host in
 * docker-compose, and scheduling in particular installs a persistent, repeating
 * workload, so they should not be callable by anything that can reach the port.
 *
 * The guard is a no-op when `V6Y_INTERNAL_API_SECRET` is unset, so upgrading
 * without setting it keeps the previous behaviour instead of breaking every
 * audit trigger. Set it on both the BFF and this service to enforce the check.
 */
@Injectable()
export class InternalApiGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const expectedSecret = process.env.V6Y_INTERNAL_API_SECRET;

        if (!expectedSecret?.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest<{
            headers?: Record<string, string | string[] | undefined>;
        }>();
        const providedSecret = request?.headers?.[INTERNAL_API_SECRET_HEADER];

        if (
            typeof providedSecret !== 'string' ||
            !isSecretMatching(providedSecret, expectedSecret)
        ) {
            AppLogger.warn(
                '[InternalApiGuard] Rejected a call to an internal endpoint: missing or invalid internal secret.',
            );
            throw new UnauthorizedException({
                success: false,
                message: 'This endpoint is restricted to internal callers.',
            });
        }

        return true;
    }
}
