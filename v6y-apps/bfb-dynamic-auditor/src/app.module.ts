import { Module } from '@nestjs/common';

import { DynamicAuditorController } from './controllers/DynamicAuditorController.ts';

@Module({
    imports: [],
    controllers: [DynamicAuditorController],
    providers: [],
})
export class AppModule {}
