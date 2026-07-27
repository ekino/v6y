import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ServerConfig from '../commons/ServerConfig.ts';

const runDevOpsAnalysis = vi.fn();

// The controller now goes through the queue service, so that is what the HTTP
// contract is asserted against.
vi.mock('../queues/DevOpsAnalysisQueueService.ts', () => ({
    DevOpsAnalysisQueueService: class {
        runDevOpsAnalysis = runDevOpsAnalysis;
    },
}));

const { createApp } = await import('../app.ts');

const { currentConfig } = ServerConfig;
const auditEndpoint = `${currentConfig?.devopsAuditorApiPath}/start-devops-auditor.json`;

describe('DevOpsAuditorController', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return 200 with success body when audits complete', async () => {
        runDevOpsAnalysis.mockResolvedValue({ status: 'success' });
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            skipped: false,
            message: 'DevOps Audits have end successfully!',
        });
        expect(runDevOpsAnalysis).toHaveBeenCalledWith({
            applicationId: 1,
            auditRunId: undefined,
        });
    });

    it('should report a skipped audit as a success rather than an error', async () => {
        runDevOpsAnalysis.mockResolvedValue({ status: 'skipped', message: 'Nothing to audit.' });
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

    it('should return 400 when applicationId is missing', async () => {
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({})
            .expect(400);

        expect(response.body).toEqual({
            success: false,
            message: 'The applicationId is required to start the DevOps Audits.',
        });
        expect(runDevOpsAnalysis).not.toHaveBeenCalled();
    });

    it('should return 500 when the analysis reports a failure', async () => {
        runDevOpsAnalysis.mockResolvedValue({ status: 'failed', message: 'auditor exploded' });
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
        runDevOpsAnalysis.mockResolvedValue(null);
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'The devops analysis queue is currently unavailable.',
        });
    });

    it('should return 500 with legacy body when the queue service throws', async () => {
        runDevOpsAnalysis.mockRejectedValue(new Error('boom'));
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'An error occurred during the DevOps Audits.',
        });
    });
});
