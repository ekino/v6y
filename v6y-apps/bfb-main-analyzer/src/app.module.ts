import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { HealthController, QueueConfig } from '@v6y/core-logic';

import { ApplicationAnalysisController } from './controllers/ApplicationAnalysisController.ts';
import { TriggerAuditController } from './controllers/TriggerAuditController.ts';
import { ApplicationAnalysisProcessor } from './queues/ApplicationAnalysisProcessor.ts';
import { APPLICATION_ANALYSIS_QUEUE } from './queues/ApplicationAnalysisQueue.ts';
import { ApplicationAnalysisQueueService } from './queues/ApplicationAnalysisQueueService.ts';
import { DataUpdateProcessor } from './queues/DataUpdateProcessor.ts';
import { DATA_UPDATE_QUEUE } from './queues/DataUpdateQueue.ts';
import { DataUpdateQueueService } from './queues/DataUpdateQueueService.ts';
import { SlackDigestScheduler } from './queues/SlackDigestScheduler.ts';

const queueEnabled = QueueConfig.isQueueEnabled();

const queueImports = queueEnabled
    ? [
          BullModule.forRoot({
              connection: QueueConfig.buildQueueConnection(),
              prefix: QueueConfig.buildQueuePrefix(),
          }),
          BullModule.registerQueue({
              name: APPLICATION_ANALYSIS_QUEUE,
          }),
          BullModule.registerQueue({
              name: DATA_UPDATE_QUEUE,
          }),
      ]
    : [];

const queueProviders = queueEnabled
    ? [ApplicationAnalysisProcessor, DataUpdateProcessor, SlackDigestScheduler]
    : [];

@Module({
    imports: [...queueImports],
    controllers: [ApplicationAnalysisController, HealthController, TriggerAuditController],
    providers: [ApplicationAnalysisQueueService, DataUpdateQueueService, ...queueProviders],
})
export class AppModule {}
