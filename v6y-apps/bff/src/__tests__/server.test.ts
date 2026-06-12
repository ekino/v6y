import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.ts';
import ServerConfig from '../config/ServerConfig.ts';

describe('BFF Server', () => {
    it('should have express-status-monitor configured at the monitoring path', async () => {
        const app = await createApp();
        const { currentConfig } = ServerConfig;
        const monitoringPath = currentConfig?.monitoringPath;

        const response = await request(app.getHttpServer())
            .get(monitoringPath as string)
            .expect(200);

        expect(response.status).toBe(200);
    });

    it('should have the app properly configured', async () => {
        const app = await createApp();
        const { currentConfig } = ServerConfig;
        const monitoringPath = currentConfig?.monitoringPath;

        // Test that the app accepts requests at monitoring path
        const response = await request(app.getHttpServer())
            .get(monitoringPath as string)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
    });

    it('should expose the health endpoint used by docker healthchecks', async () => {
        const app = await createApp();

        const response = await request(app.getHttpServer()).get('/health').expect(200);

        expect(response.body).toEqual({ success: true, message: 'OK' });
    });
});
