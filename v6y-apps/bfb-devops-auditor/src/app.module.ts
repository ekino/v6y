import { Module } from '@nestjs/common';

import { DevOpsAuditorController } from './controllers/DevOpsAuditorController.ts';

@Module({
    imports: [],
    controllers: [DevOpsAuditorController],
    providers: [],
})
export class AppModule {}
