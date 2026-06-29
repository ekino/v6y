import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const validateCredentialsMock = vi.fn();

vi.mock('@v6y/core-logic', async () => {
    const actual = await vi.importActual<typeof import('@v6y/core-logic')>('@v6y/core-logic');

    return {
        ...actual,
        validateCredentials: validateCredentialsMock,
    };
});

describe('TriggerApplicationAnalysis mutation', () => {
    beforeEach(() => {
        process.env.V6Y_BFF_API_PATH = '/v6y/graphql/';
        process.env.V6Y_MAIN_ANALYZER_TRIGGER_API_PATH =
            'http://localhost:4002/v6y/bfb-main/trigger-application-analysis.json';
        validateCredentialsMock.mockResolvedValue({ role: 'ADMIN', applications: [42] });
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({
                    success: true,
                    message: 'Application analysis queued successfully.',
                    applicationId: 42,
                }),
            }),
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('should forward the mutation to the main analyzer trigger endpoint', async () => {
        const { createApp } = await import('../app.ts');
        const { default: ServerConfig } = await import('../config/ServerConfig.ts');

        const app = await createApp();

        const response = await request(app.getHttpServer())
            .post(ServerConfig.currentConfig?.apiPath as string)
            .send({
                operationName: 'TriggerApplicationAnalysis',
                query: `
                    mutation TriggerApplicationAnalysis($applicationId: Int!) {
                        triggerApplicationAnalysis(applicationId: $applicationId) {
                            success
                            applicationId
                            message
                        }
                    }
                `,
                variables: {
                    applicationId: 42,
                },
            })
            .expect(200);

        expect(validateCredentialsMock).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith(
            process.env.V6Y_MAIN_ANALYZER_TRIGGER_API_PATH,
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: 42 }),
            }),
        );
        expect(response.body).toEqual({
            data: {
                triggerApplicationAnalysis: {
                    success: true,
                    applicationId: 42,
                    message: 'Application analysis queued successfully.',
                },
            },
        });

        await app.close();
    });
});
