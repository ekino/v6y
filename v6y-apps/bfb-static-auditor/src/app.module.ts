import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { HealthController, QueueConfig } from '@v6y/core-logic';

import { StaticAuditorController } from './controllers/StaticAuditorController.ts';
import { StaticAnalysisProcessor } from './queues/StaticAnalysisProcessor.ts';
import { STATIC_ANALYSIS_QUEUE } from './queues/StaticAnalysisQueue.ts';
import { StaticAnalysisQueueService } from './queues/StaticAnalysisQueueService.ts';

const queueEnabled = QueueConfig.isQueueEnabled();

const queueImports = queueEnabled
    ? [
          BullModule.forRoot({
              connection: QueueConfig.buildQueueConnection(),
              prefix: QueueConfig.buildQueuePrefix(),
          }),
          BullModule.registerQueue({
              name: STATIC_ANALYSIS_QUEUE,
          }),
      ]
    : [];

const queueProviders = queueEnabled ? [StaticAnalysisProcessor] : [];

@Module({
    imports: [...queueImports],
    controllers: [StaticAuditorController, HealthController],
    providers: [StaticAnalysisQueueService, ...queueProviders],
})
export class AppModule {}
