import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AuditOutcome } from '../auditors/types/AuditCommonsType.ts';

/**
 * The controller reaches the analysis through the queue service, so the HTTP
 * contract is asserted by stubbing that service on the real provider: Nest keeps
 * resolving it normally and the spy stands in for the queued run.
 */
const buildApp = async (outcome: AuditOutcome | null, rejection?: Error) => {
    const { createApp } = await import('../app.ts');
    const { StaticAnalysisQueueService } = await import('../queues/StaticAnalysisQueueService.ts');

    const spy = vi.spyOn(StaticAnalysisQueueService.prototype, 'runStaticAnalysis');
    if (rejection) {
        spy.mockRejectedValue(rejection);
    } else {
        spy.mockResolvedValue(outcome);
    }

    return { spy, app: await createApp() };
};

const endpoint = async () => {
    const { default: ServerConfig } = await import('../commons/ServerConfig.ts');
    return `${ServerConfig.currentConfig?.staticAuditorApiPath}/start-static-auditor.json`;
};

describe('StaticAuditorController', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
    });

    it('should return 200 with success body when audits complete', async () => {
        const { spy, app } = await buildApp({ status: 'success' });

        const response = await request(app.getHttpServer())
            .post(await endpoint())
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            skipped: false,
            message: 'Static Code Audits have end successfully!',
        });
        expect(spy).toHaveBeenCalledWith({
            applicationId: 1,
            workspaceFolder: '/tmp/workspace',
            auditRunId: undefined,
        });

        await app.close();
    });

    it('should report a skipped audit as a success rather than an error', async () => {
        const { app } = await buildApp({ status: 'skipped', message: 'Nothing to audit.' });

        const response = await request(app.getHttpServer())
            .post(await endpoint())
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            skipped: true,
            message: 'Nothing to audit.',
        });

        await app.close();
    });

    it('should return 500 when the analysis reports a failure', async () => {
        const { app } = await buildApp({ status: 'failed', message: 'auditor exploded' });

        const response = await request(app.getHttpServer())
            .post(await endpoint())
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'auditor exploded',
        });

        await app.close();
    });

    it('should return 500 when the queue is unavailable', async () => {
        const { app } = await buildApp(null);

        const response = await request(app.getHttpServer())
            .post(await endpoint())
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'The static code analysis queue is currently unavailable.',
        });

        await app.close();
    });

    it('should return 500 with legacy body when the queue service throws', async () => {
        const { app } = await buildApp(null, new Error('boom'));

        const response = await request(app.getHttpServer())
            .post(await endpoint())
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'An error occurred during the Static Code Audits.',
        });

        await app.close();
    });
});
