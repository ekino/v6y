import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ServerConfig from '../commons/ServerConfig.ts';

const runStaticAnalysis = vi.fn();

// The controller now goes through the queue service, so that is what the HTTP
// contract is asserted against.
vi.mock('../queues/StaticAnalysisQueueService.ts', () => ({
    StaticAnalysisQueueService: class {
        runStaticAnalysis = runStaticAnalysis;
    },
}));

const { createApp } = await import('../app.ts');

const { currentConfig } = ServerConfig;
const auditEndpoint = `${currentConfig?.staticAuditorApiPath}/start-static-auditor.json`;

describe('StaticAuditorController', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return 200 with success body when audits complete', async () => {
        runStaticAnalysis.mockResolvedValue({ status: 'success' });
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            skipped: false,
            message: 'Static Code Audits have end successfully!',
        });
        expect(runStaticAnalysis).toHaveBeenCalledWith({
            applicationId: 1,
            workspaceFolder: '/tmp/workspace',
            auditRunId: undefined,
        });
    });

    it('should report a skipped audit as a success rather than an error', async () => {
        runStaticAnalysis.mockResolvedValue({ status: 'skipped', message: 'Nothing to audit.' });
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            skipped: true,
            message: 'Nothing to audit.',
        });
    });

    it('should return 500 when the analysis reports a failure', async () => {
        runStaticAnalysis.mockResolvedValue({ status: 'failed', message: 'auditor exploded' });
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'auditor exploded',
        });
    });

    it('should return 500 when the queue is unavailable', async () => {
        runStaticAnalysis.mockResolvedValue(null);
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'The static code analysis queue is currently unavailable.',
        });
    });

    it('should return 500 with legacy body when the queue service throws', async () => {
        runStaticAnalysis.mockRejectedValue(new Error('boom'));
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'An error occurred during the Static Code Audits.',
        });
    });
});
