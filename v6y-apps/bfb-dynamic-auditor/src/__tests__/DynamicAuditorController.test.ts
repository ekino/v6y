import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DynamicAuditorManager from '../auditors/DynamicAuditorManager.ts';
import ServerConfig from '../commons/ServerConfig.ts';

vi.mock('../auditors/DynamicAuditorManager.ts', () => ({
    default: {
        startDynamicAudit: vi.fn(),
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
        vi.mocked(DynamicAuditorManager.startDynamicAudit).mockResolvedValue(true);
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            message: 'Dynamic Audits have end successfully!',
        });
        expect(DynamicAuditorManager.startDynamicAudit).toHaveBeenCalledWith({
            applicationId: 1,
        });
    });

    it('should return 500 with legacy body when the manager reports a failure', async () => {
        vi.mocked(DynamicAuditorManager.startDynamicAudit).mockResolvedValue(false);
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'An error occurred while starting the Dynamic Audits.',
        });
    });

    it('should return 500 with legacy body when the manager throws', async () => {
        vi.mocked(DynamicAuditorManager.startDynamicAudit).mockRejectedValue(new Error('boom'));
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
