import { Module } from '@nestjs/common';

import { HealthController } from '@v6y/core-logic';

import { TriggerAuditController } from './controllers/TriggerAuditController.ts';

@Module({
    imports: [],
    controllers: [HealthController, TriggerAuditController],
    providers: [],
})
export class AppModule {}
