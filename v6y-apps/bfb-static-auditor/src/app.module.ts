import { Module } from '@nestjs/common';

import { HealthController } from '@v6y/core-logic';

import { StaticAuditorController } from './controllers/StaticAuditorController.ts';

@Module({
    imports: [],
    controllers: [StaticAuditorController, HealthController],
    providers: [],
})
export class AppModule {}
