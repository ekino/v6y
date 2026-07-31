import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('ApplicationAnalysisController', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
        delete process.env.V6Y_INTERNAL_API_SECRET;
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
            .mockResolvedValue({ id: 'job-1' } as never);

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

    it('should fail when the analysis queue is unavailable', async () => {
        process.env.V6Y_MAIN_API_PATH = '/v6y/bfb-main/';

        const { createApp } = await import('../app.ts');
        const { default: ServerConfig } = await import('../config/ServerConfig.ts');
        const { ApplicationAnalysisQueueService } = await import(
            '../queues/ApplicationAnalysisQueueService.ts'
        );

        vi.spyOn(
            ApplicationAnalysisQueueService.prototype,
            'enqueueApplicationAnalysis',
        ).mockResolvedValue(null);

        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(`${ServerConfig.currentConfig?.apiPath}trigger-application-analysis.json`)
            .send({ applicationId: 42 })
            .expect(500);

        expect(response.body.message).toBe(
            'The application analysis queue is currently unavailable.',
        );

        await app.close();
    });

    it('should reject a cron expression that schedules audits too frequently', async () => {
        process.env.V6Y_MAIN_API_PATH = '/v6y/bfb-main/';

        const { createApp } = await import('../app.ts');
        const { default: ServerConfig } = await import('../config/ServerConfig.ts');
        const { ApplicationAnalysisQueueService } = await import(
            '../queues/ApplicationAnalysisQueueService.ts'
        );

        const upsertSpy = vi
            .spyOn(ApplicationAnalysisQueueService.prototype, 'upsertApplicationSchedule')
            .mockResolvedValue({ id: 'sched-1' } as never);

        const app = await createApp();

        // node-cron considers this valid, and it would clone the repository and run
        // the full audit suite every second, forever.
        const response = await request(app.getHttpServer())
            .post(`${ServerConfig.currentConfig?.apiPath}schedule-application-analysis.json`)
            .send({ applicationId: 42, cron: '* * * * * *', enabled: true })
            .expect(400);

        expect(response.body.message).toContain('too frequently');
        expect(upsertSpy).not.toHaveBeenCalled();

        await app.close();
    });

    it('should accept a preset cron expression and install the schedule', async () => {
        process.env.V6Y_MAIN_API_PATH = '/v6y/bfb-main/';

        const { createApp } = await import('../app.ts');
        const { default: ServerConfig } = await import('../config/ServerConfig.ts');
        const { ApplicationAnalysisQueueService } = await import(
            '../queues/ApplicationAnalysisQueueService.ts'
        );

        const upsertSpy = vi
            .spyOn(ApplicationAnalysisQueueService.prototype, 'upsertApplicationSchedule')
            .mockResolvedValue({ id: 'sched-1' } as never);

        const app = await createApp();

        await request(app.getHttpServer())
            .post(`${ServerConfig.currentConfig?.apiPath}schedule-application-analysis.json`)
            .send({ applicationId: 42, cron: '0 */6 * * *', enabled: true })
            .expect(200);

        expect(upsertSpy).toHaveBeenCalledWith(42, '0 */6 * * *');

        await app.close();
    });

    it('should reject a call without the internal secret once one is configured', async () => {
        process.env.V6Y_MAIN_API_PATH = '/v6y/bfb-main/';
        process.env.V6Y_INTERNAL_API_SECRET = 'a-shared-secret';

        const { createApp } = await import('../app.ts');
        const { default: ServerConfig } = await import('../config/ServerConfig.ts');
        const { ApplicationAnalysisQueueService } = await import(
            '../queues/ApplicationAnalysisQueueService.ts'
        );

        const upsertSpy = vi
            .spyOn(ApplicationAnalysisQueueService.prototype, 'upsertApplicationSchedule')
            .mockResolvedValue({ id: 'sched-1' } as never);

        const app = await createApp();
        const scheduleUrl = `${ServerConfig.currentConfig?.apiPath}schedule-application-analysis.json`;

        await request(app.getHttpServer())
            .post(scheduleUrl)
            .send({ applicationId: 42, cron: '0 0 * * *', enabled: true })
            .expect(401);

        await request(app.getHttpServer())
            .post(scheduleUrl)
            .set('x-v6y-internal-secret', 'the-wrong-secret')
            .send({ applicationId: 42, cron: '0 0 * * *', enabled: true })
            .expect(401);

        expect(upsertSpy).not.toHaveBeenCalled();

        await request(app.getHttpServer())
            .post(scheduleUrl)
            .set('x-v6y-internal-secret', 'a-shared-secret')
            .send({ applicationId: 42, cron: '0 0 * * *', enabled: true })
            .expect(200);

        expect(upsertSpy).toHaveBeenCalledWith(42, '0 0 * * *');

        await app.close();
    });
});
