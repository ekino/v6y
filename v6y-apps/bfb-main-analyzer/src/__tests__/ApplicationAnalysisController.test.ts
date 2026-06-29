import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('ApplicationAnalysisController', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
    });

    it('should enqueue a single application analysis job', async () => {
        process.env.V6Y_MAIN_API_PATH = '/v6y/bfb-main/';

        const { createApp } = await import('../app.ts');
        const { default: ServerConfig } = await import('../config/ServerConfig.ts');
        const { ApplicationAnalysisQueueService } = await import(
            '../queues/ApplicationAnalysisQueueService.ts'
        );

        const enqueueSpy = vi
            .spyOn(ApplicationAnalysisQueueService.prototype, 'enqueueApplicationAnalysis')
            .mockResolvedValue(null);

        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(`${ServerConfig.currentConfig?.apiPath}trigger-application-analysis.json`)
            .send({ applicationId: 42 })
            .expect(200);

        expect(enqueueSpy).toHaveBeenCalledWith(42);
        expect(response.body).toEqual({
            success: true,
            message: 'Application analysis queued successfully.',
            applicationId: 42,
        });

        await app.close();
    });
});
