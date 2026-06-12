import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DevOpsAuditorManager from '../auditors/DevOpsAuditorManager.ts';
import ServerConfig from '../commons/ServerConfig.ts';

vi.mock('../auditors/DevOpsAuditorManager.ts', () => ({
    default: {
        startDevOpsAudit: vi.fn(),
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
        vi.mocked(DevOpsAuditorManager.startDevOpsAudit).mockResolvedValue(true);
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            message: 'DevOps Audits have end successfully!',
        });
        expect(DevOpsAuditorManager.startDevOpsAudit).toHaveBeenCalledWith({
            applicationId: 1,
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
        expect(DevOpsAuditorManager.startDevOpsAudit).not.toHaveBeenCalled();
    });

    it('should return 500 with legacy body when the manager reports a failure', async () => {
        vi.mocked(DevOpsAuditorManager.startDevOpsAudit).mockResolvedValue(false);
        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(auditEndpoint)
            .send({ applicationId: 1 })
            .expect(500);

        expect(response.body).toEqual({
            success: false,
            message: 'An error occurred while starting the DevOps Audits.',
        });
    });

    it('should return 500 with legacy body when the manager throws', async () => {
        vi.mocked(DevOpsAuditorManager.startDevOpsAudit).mockRejectedValue(new Error('boom'));
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
