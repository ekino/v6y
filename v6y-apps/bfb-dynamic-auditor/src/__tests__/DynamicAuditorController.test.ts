import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ServerConfig from '../commons/ServerConfig.ts';

const runDynamicAnalysis = vi.fn();

// The controller now goes through the queue service, so that is what the HTTP
// contract is asserted against.
vi.mock('../queues/DynamicAnalysisQueueService.ts', () => ({
    DynamicAnalysisQueueService: class {
        runDynamicAnalysis = runDynamicAnalysis;
    },
}));

const { createApp } = await import('../app.ts');

const { currentConfig } = ServerConfig;
const auditEndpoint = `${currentConfig?.dynamicAuditorApiPath}/start-dynamic-auditor.json`;

describe('DynamicAuditorController', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return 200 with success body when audits complete', async () => {
        runDynamicAnalysis.mockResolvedValue({ status: 'success' });
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            skipped: false,
            message: 'Dynamic Audits have end successfully!',
        });
        expect(runDynamicAnalysis).toHaveBeenCalledWith({
            applicationId: 1,
            auditRunId: undefined,
        });
    });

    it('should report a skipped audit as a success rather than an error', async () => {
        runDynamicAnalysis.mockResolvedValue({ status: 'skipped', message: 'Nothing to audit.' });
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            skipped: true,
            message: 'Nothing to audit.',
        });
    });

    it('should return 500 when the analysis reports a failure', async () => {
        runDynamicAnalysis.mockResolvedValue({ status: 'failed', message: 'auditor exploded' });
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'auditor exploded',
        });
    });

    it('should return 500 when the queue is unavailable', async () => {
        runDynamicAnalysis.mockResolvedValue(null);
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'The dynamic analysis queue is currently unavailable.',
        });
    });

    it('should return 500 with legacy body when the queue service throws', async () => {
        runDynamicAnalysis.mockRejectedValue(new Error('boom'));
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'An error occurred during the Dynamic Audits.',
        });
    });
});
