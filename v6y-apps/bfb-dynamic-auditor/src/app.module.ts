import { Module } from '@nestjs/common';

import { HealthController } from '@v6y/core-logic';

import { DynamicAuditorController } from './controllers/DynamicAuditorController.ts';

@Module({
    imports: [],
    controllers: [DynamicAuditorController, HealthController],
    providers: [],
})
export class AppModule {}
