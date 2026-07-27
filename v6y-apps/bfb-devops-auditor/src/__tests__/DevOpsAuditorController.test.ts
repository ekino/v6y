import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MockInstance, afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { DevOpsAnalysisQueueService } from '../queues/DevOpsAnalysisQueueService.ts';

/**
 * The controller reaches the analysis through the queue service, so the HTTP
 * contract is asserted by stubbing that service on the real provider prototype:
 * Nest keeps resolving the provider normally and the stub stands in for the
 * queued run.
 *
 * The application is booted once for the whole file — booting one per test case
 * made the suite slow enough to time out when the workspace runs projects in
 * parallel.
 */
let app: INestApplication;
let endpoint: string;
let runAnalysis: MockInstance;

beforeAll(async () => {
    const { createApp } = await import('../app.ts');
    const { default: ServerConfig } = await import('../commons/ServerConfig.ts');

    runAnalysis = vi.spyOn(DevOpsAnalysisQueueService.prototype, 'runDevOpsAnalysis');
    endpoint = `${ServerConfig.currentConfig?.devopsAuditorApiPath}/start-devops-auditor.json`;
    app = await createApp();
});

afterAll(async () => {
    vi.restoreAllMocks();
    await app?.close();
});

describe('DevOpsAuditorController', () => {
    beforeEach(() => {
        runAnalysis.mockReset();
    });

    it('should return 200 with success body when audits complete', async () => {
        runAnalysis.mockResolvedValue({ status: 'success' });

        const response = await request(app.getHttpServer())
            .post(endpoint)
            .send({ applicationId: 1 })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            skipped: false,
            message: 'DevOps Audits have end successfully!',
        });
        expect(runAnalysis).toHaveBeenCalledWith({
            applicationId: 1,
            auditRunId: undefined,
        });
    });

    it('should report a skipped audit as a success rather than an error', async () => {
        runAnalysis.mockResolvedValue({ status: 'skipped', message: 'Nothing to audit.' });

        const response = await request(app.getHttpServer())
            .post(endpoint)
            .send({ applicationId: 1 })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            skipped: true,
            message: 'Nothing to audit.',
        });
    });

    it('should return 400 when applicationId is missing', async () => {
        const response = await request(app.getHttpServer()).post(endpoint).send({}).expect(400);

        expect(response.body).toEqual({
            success: false,
            message: 'The applicationId is required to start the DevOps Audits.',
        });
        expect(runAnalysis).not.toHaveBeenCalled();
    });

    it('should return 500 when the analysis reports a failure', async () => {
        runAnalysis.mockResolvedValue({ status: 'failed', message: 'auditor exploded' });

        const response = await request(app.getHttpServer())
            .post(endpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'auditor exploded',
        });
    });

    it('should return 500 when the queue is unavailable', async () => {
        runAnalysis.mockResolvedValue(null);

        const response = await request(app.getHttpServer())
            .post(endpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'The DevOps analysis queue is currently unavailable.',
        });
    });

    it('should return 500 with legacy body when the queue service throws', async () => {
        runAnalysis.mockRejectedValue(new Error('boom'));

        const response = await request(app.getHttpServer())
            .post(endpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'An error occurred during the DevOps Audits.',
        });
    });
});
