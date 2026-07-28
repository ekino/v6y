import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { HealthController, QueueConfig } from '@v6y/core-logic';

import { DevOpsAuditorController } from './controllers/DevOpsAuditorController.ts';
import { DevOpsAnalysisProcessor } from './queues/DevOpsAnalysisProcessor.ts';
import { DEVOPS_ANALYSIS_QUEUE } from './queues/DevOpsAnalysisQueue.ts';
import { DevOpsAnalysisQueueService } from './queues/DevOpsAnalysisQueueService.ts';

const queueEnabled = QueueConfig.isQueueEnabled();

const queueImports = queueEnabled
    ? [
          BullModule.forRoot({
              connection: QueueConfig.buildQueueConnection(),
              prefix: QueueConfig.buildQueuePrefix(),
          }),
          BullModule.registerQueue({
              name: DEVOPS_ANALYSIS_QUEUE,
          }),
      ]
    : [];

const queueProviders = queueEnabled ? [DevOpsAnalysisProcessor] : [];

@Module({
    imports: [...queueImports],
    controllers: [DevOpsAuditorController, HealthController],
    providers: [DevOpsAnalysisQueueService, ...queueProviders],
})
export class AppModule {}
