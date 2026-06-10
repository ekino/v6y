import { Module } from '@nestjs/common';

import { StaticAuditorController } from './controllers/StaticAuditorController.ts';

@Module({
    imports: [],
    controllers: [StaticAuditorController],
    providers: [],
})
export class AppModule {}
