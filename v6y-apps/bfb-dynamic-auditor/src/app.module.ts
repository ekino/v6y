import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { HealthController, QueueConfig } from '@v6y/core-logic';

import { DynamicAuditorController } from './controllers/DynamicAuditorController.ts';
import { DynamicAnalysisProcessor } from './queues/DynamicAnalysisProcessor.ts';
import { DYNAMIC_ANALYSIS_QUEUE } from './queues/DynamicAnalysisQueue.ts';
import { DynamicAnalysisQueueService } from './queues/DynamicAnalysisQueueService.ts';

const queueEnabled = QueueConfig.isQueueEnabled();

const queueImports = queueEnabled
    ? [
          BullModule.forRoot({
              connection: QueueConfig.buildQueueConnection(),
              prefix: QueueConfig.buildQueuePrefix(),
          }),
          BullModule.registerQueue({
              name: DYNAMIC_ANALYSIS_QUEUE,
          }),
      ]
    : [];

const queueProviders = queueEnabled ? [DynamicAnalysisProcessor] : [];

@Module({
    imports: [...queueImports],
    controllers: [DynamicAuditorController, HealthController],
    providers: [DynamicAnalysisQueueService, ...queueProviders],
})
export class AppModule {}
