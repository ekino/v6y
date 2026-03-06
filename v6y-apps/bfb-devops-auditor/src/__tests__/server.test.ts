import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.ts';
import ServerConfig from '../commons/ServerConfig.ts';

describe('DevOps Auditor Server', () => {
    it('should have express-status-monitor configured at the monitoring path', async () => {
        const app = createApp();
        const { currentConfig } = ServerConfig;
        const monitoringPath = currentConfig?.monitoringPath;

        const response = await request(app)
            .get(monitoringPath as string)
            .expect(200);

        expect(response.status).toBe(200);
    });

    it('should respond with 404 for unknown routes', async () => {
        const app = createApp();

        const response = await request(app).get('/unknown-route').expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('does not exist');
    });

    it('should have the app properly configured with middleware', async () => {
        const app = createApp();

        // Test that the app accepts JSON
        const response = await request(app)
            .get('/unknown-route')
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(404);
    });
});
