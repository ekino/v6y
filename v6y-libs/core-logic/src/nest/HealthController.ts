import { Controller, Get } from '@nestjs/common';

/**
 * Health endpoint targeted by the docker-compose healthchecks
 * (curl -f http://localhost:PORT/health).
 *
 * Nest decorators are applied as plain function calls instead of decorator
 * syntax: tsx only applies the `experimentalDecorators` tsconfig option of
 * the package it is launched from, so decorator syntax in this shared
 * library would be mis-transpiled when apps import it at runtime.
 */
export class HealthController {
    getHealth(): { success: boolean; message: string } {
        return { success: true, message: 'OK' };
    }
}

Controller('health')(HealthController);
Get()(
    HealthController.prototype,
    'getHealth',
    Object.getOwnPropertyDescriptor(HealthController.prototype, 'getHealth') as PropertyDescriptor,
);
