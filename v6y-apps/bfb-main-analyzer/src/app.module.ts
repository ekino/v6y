import { Module } from '@nestjs/common';

import { HealthController } from '@v6y/core-logic';

@Module({
    imports: [],
    controllers: [HealthController],
    providers: [],
})
export class AppModule {}
