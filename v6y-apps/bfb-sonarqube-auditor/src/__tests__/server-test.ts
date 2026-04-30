import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../app.ts';
import ServerConfig from '../commons/ServerConfig.ts';

vi.mock('../auditors/SonarQubeAuditorManager.ts', () => ({
    default: {
        getSonarQubeMetrics: vi.fn(),
    },
}));

// Import after mock so we get the mocked version
const { default: SonarQubeAuditorManager } = await import('../auditors/SonarQubeAuditorManager.ts');

const app = createApp();
const { currentConfig } = ServerConfig;
const AUDITOR_PATH = `${currentConfig?.sonarqubeAuditorApiPath}/get-sonarqube-metrics.json`;

describe('SonarQube Auditor Server', () => {
    it('should have express-status-monitor configured at the monitoring path', async () => {
        const { currentConfig } = ServerConfig;
        const monitoringPath = currentConfig?.monitoringPath;

        const response = await request(app).get(monitoringPath as string);
        expect(response.status).toBe(200);
    });

    it('should respond with 404 for unknown routes', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('does not exist');
    });
});

describe('SonarQubeAuditorRouter - POST /get-sonarqube-metrics.json', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns 400 when sonarUrl is missing', async () => {
        const response = await request(app)
            .post(AUDITOR_PATH)
            .send({})
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/sonarUrl is required/);
    });

    it('returns 200 with manager result on success', async () => {
        const mockResult = {
            success: true,
            projectKey: 'my-project',
            baseUrl: 'https://sonar.example.com',
            qualityGate: { status: 'OK', name: 'Sonar Way' },
            metrics: [{ key: 'coverage', name: 'Code Coverage', value: '82.5', rating: null }],
            error: null,
        };
        vi.mocked(SonarQubeAuditorManager.getSonarQubeMetrics).mockResolvedValue(mockResult);

        const response = await request(app)
            .post(AUDITOR_PATH)
            .send({ sonarUrl: 'https://sonar.example.com/dashboard?id=my-project' })
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.projectKey).toBe('my-project');
        expect(response.body.metrics).toHaveLength(1);
    });

    it('forwards token to manager when provided', async () => {
        vi.mocked(SonarQubeAuditorManager.getSonarQubeMetrics).mockResolvedValue({
            success: true,
            metrics: [],
            error: null,
        });

        await request(app).post(AUDITOR_PATH).send({
            sonarUrl: 'https://sonar.example.com/dashboard?id=my-project',
            token: 'secret',
        });

        expect(SonarQubeAuditorManager.getSonarQubeMetrics).toHaveBeenCalledWith({
            sonarUrl: 'https://sonar.example.com/dashboard?id=my-project',
            token: 'secret',
        });
    });

    it('returns 200 with manager error result when sonarqube call fails', async () => {
        vi.mocked(SonarQubeAuditorManager.getSonarQubeMetrics).mockResolvedValue({
            success: false,
            error: 'SonarQube API returned 401',
        });

        const response = await request(app)
            .post(AUDITOR_PATH)
            .send({ sonarUrl: 'https://sonar.example.com/dashboard?id=my-project' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toMatch(/401/);
    });

    it('returns 500 when manager throws unexpectedly', async () => {
        vi.mocked(SonarQubeAuditorManager.getSonarQubeMetrics).mockRejectedValue(
            new Error('Unexpected crash'),
        );

        const response = await request(app)
            .post(AUDITOR_PATH)
            .send({ sonarUrl: 'https://sonar.example.com/dashboard?id=my-project' });

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
    });
});
