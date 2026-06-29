import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StaticAuditorManager from '../auditors/StaticAuditorManager.ts';
import ServerConfig from '../commons/ServerConfig.ts';

vi.mock('../auditors/StaticAuditorManager.ts', () => ({
    default: {
        startStaticAudit: vi.fn(),
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
        vi.mocked(StaticAuditorManager.startStaticAudit).mockResolvedValue(true);
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1, workspaceFolder: '/tmp/workspace' })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            message: 'Static Code Audits have end successfully!',
        });
        expect(StaticAuditorManager.startStaticAudit).toHaveBeenCalledWith({
            applicationId: 1,
            workspaceFolder: '/tmp/workspace',
        });
    });

    it('should return 500 with legacy body when the manager reports a failure', async () => {
        vi.mocked(StaticAuditorManager.startStaticAudit).mockResolvedValue(false);
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'An error occurred while starting the Static Code Audits.',
        });
    });

    it('should return 500 with legacy body when the manager throws', async () => {
        vi.mocked(StaticAuditorManager.startStaticAudit).mockRejectedValue(new Error('boom'));
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'An error occurred during the Static Code Audits.',
        });
    });
});
