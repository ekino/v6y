import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { HealthController } from '@v6y/core-logic';

import { ApplicationAnalysisController } from './controllers/ApplicationAnalysisController.ts';
import { ApplicationAnalysisProcessor } from './queues/ApplicationAnalysisProcessor.ts';
import {
    APPLICATION_ANALYSIS_QUEUE,
    isApplicationAnalysisQueueEnabled,
} from './queues/ApplicationAnalysisQueue.ts';
import { ApplicationAnalysisQueueService } from './queues/ApplicationAnalysisQueueService.ts';

const queueEnabled = isApplicationAnalysisQueueEnabled();

const queueImports = queueEnabled
    ? [
          BullModule.forRoot({
              connection: {
                  host: process.env.V6Y_QUEUE_HOST || 'localhost',
                  port: parseInt(process.env.V6Y_QUEUE_PORT || '6379', 10),
              },
              prefix: process.env.V6Y_QUEUE_PREFIX || 'v6y',
          }),
          BullModule.registerQueue({
              name: APPLICATION_ANALYSIS_QUEUE,
          }),
      ]
    : [];

const queueProviders = queueEnabled ? [ApplicationAnalysisProcessor] : [];

@Module({
    imports: [...queueImports],
    controllers: [ApplicationAnalysisController, HealthController],
    providers: [ApplicationAnalysisQueueService, ...queueProviders],
})
export class AppModule {}
