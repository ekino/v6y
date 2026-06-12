import { Module } from '@nestjs/common';

import { HealthController } from '@v6y/core-logic';

import { DevOpsAuditorController } from './controllers/DevOpsAuditorController.ts';

@Module({
    imports: [],
    controllers: [DevOpsAuditorController, HealthController],
    providers: [],
})
export class AppModule {}
