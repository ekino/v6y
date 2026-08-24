import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const validateCredentialsMock = vi.fn();
const getByAppIdMock = vi.fn();
const upsertMock = vi.fn();
const getApplicationDetailsInfoByParamsMock = vi.fn();
const getDependencyListByPageAndParamsMock = vi.fn();
const getAuditListByPageAndParamsMock = vi.fn();
const generateChatCompletionMock = vi.fn();

vi.mock('@v6y/core-logic', async () => {
    const actual = await vi.importActual<typeof import('@v6y/core-logic')>('@v6y/core-logic');

    return {
        ...actual,
        validateCredentials: validateCredentialsMock,
        AiSummaryReportProvider: {
            ...actual.AiSummaryReportProvider,
            getByAppId: getByAppIdMock,
            upsert: upsertMock,
        },
        ApplicationProvider: {
            ...actual.ApplicationProvider,
            getApplicationDetailsInfoByParams: getApplicationDetailsInfoByParamsMock,
        },
        DependencyProvider: {
            ...actual.DependencyProvider,
            getDependencyListByPageAndParams: getDependencyListByPageAndParamsMock,
        },
        AuditProvider: {
            ...actual.AuditProvider,
            getAuditListByPageAndParams: getAuditListByPageAndParamsMock,
        },
        LiteLLMApi: {
            ...actual.LiteLLMApi,
            generateChatCompletion: generateChatCompletionMock,
        },
    };
});

const GENERATE_MUTATION = `
    mutation GenerateApplicationAiSummary($applicationId: Int!) {
        generateApplicationAiSummary(applicationId: $applicationId) {
            success
            message
            report {
                _id
                appId
                summary
                model
            }
        }
    }
`;

const GET_QUERY = `
    query GetApplicationAiSummaryByParams($_id: Int!) {
        getApplicationAiSummaryByParams(_id: $_id) {
            _id
            appId
            summary
        }
    }
`;

describe('AI summary report', () => {
    beforeEach(() => {
        process.env.V6Y_BFF_API_PATH = '/v6y/graphql/';
        validateCredentialsMock.mockResolvedValue({ role: 'ADMIN', applications: [42] });
        getDependencyListByPageAndParamsMock.mockResolvedValue([]);
        getAuditListByPageAndParamsMock.mockResolvedValue([]);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    describe('generateApplicationAiSummary mutation', () => {
        it('generates a summary using the application data and its latest audit run results', async () => {
            getApplicationDetailsInfoByParamsMock.mockResolvedValue({
                _id: 42,
                name: 'Vitality',
                description: 'A code audit platform',
            });
            getDependencyListByPageAndParamsMock.mockResolvedValue([
                { type: 'npm', name: 'react', version: '18.0.0' },
            ]);
            getAuditListByPageAndParamsMock.mockResolvedValue([
                { category: 'performance', score: 88, scoreStatus: 'success' },
            ]);
            generateChatCompletionMock.mockResolvedValue({
                content: 'Fresh synthesis',
                model: 'gpt-4o-mini',
                tokensUsed: 120,
            });
            upsertMock.mockResolvedValue({
                _id: 2,
                appId: 42,
                summary: 'Fresh synthesis',
                model: 'gpt-4o-mini',
            });

            const { createApp } = await import('../app.ts');
            const { default: ServerConfig } = await import('../config/ServerConfig.ts');
            const app = await createApp();

            const response = await request(app.getHttpServer())
                .post(ServerConfig.currentConfig?.apiPath as string)
                .send({
                    operationName: 'GenerateApplicationAiSummary',
                    query: GENERATE_MUTATION,
                    variables: { applicationId: 42 },
                })
                .expect(200);

            expect(getAuditListByPageAndParamsMock).toHaveBeenCalledWith({ appId: 42 });
            expect(generateChatCompletionMock).toHaveBeenCalledTimes(1);
            const [messages] = generateChatCompletionMock.mock.calls[0];
            expect(messages[1].content).toContain('performance: 88');

            expect(upsertMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    appId: 42,
                    summary: 'Fresh synthesis',
                    model: 'gpt-4o-mini',
                    tokensUsed: 120,
                }),
            );
            expect(response.body.data.generateApplicationAiSummary).toEqual(
                expect.objectContaining({
                    success: true,
                    report: expect.objectContaining({ appId: 42, summary: 'Fresh synthesis' }),
                }),
            );

            await app.close();
        }, 15000);

        it('includes every audited category even when they were audited across different runs', async () => {
            getApplicationDetailsInfoByParamsMock.mockResolvedValue({ _id: 42, name: 'Vitality' });
            // Simulates categories last audited at different times (e.g. only 'performance' was
            // re-run most recently) rather than all coming from a single latest audit run.
            getAuditListByPageAndParamsMock.mockResolvedValue([
                {
                    category: 'security',
                    score: 40,
                    scoreStatus: 'error',
                    dateEnd: '2026-01-01T00:00:00.000Z',
                },
                {
                    category: 'devops',
                    score: 70,
                    scoreStatus: 'warning',
                    dateEnd: '2026-01-02T00:00:00.000Z',
                },
                {
                    category: 'ecodesign',
                    score: 75,
                    scoreStatus: 'success',
                    dateEnd: '2026-01-03T00:00:00.000Z',
                },
                {
                    category: 'accessibility',
                    score: 90,
                    scoreStatus: 'success',
                    dateEnd: '2026-01-04T00:00:00.000Z',
                },
                {
                    category: 'maintainability',
                    score: 60,
                    scoreStatus: 'warning',
                    dateEnd: '2026-01-05T00:00:00.000Z',
                },
                {
                    category: 'performance',
                    score: 88,
                    scoreStatus: 'success',
                    dateEnd: '2026-01-06T00:00:00.000Z',
                },
            ]);
            generateChatCompletionMock.mockResolvedValue({
                content: 'Full synthesis',
                model: 'gpt-4o-mini',
                tokensUsed: 150,
            });
            upsertMock.mockResolvedValue({
                _id: 5,
                appId: 42,
                summary: 'Full synthesis',
                model: 'gpt-4o-mini',
            });

            const { createApp } = await import('../app.ts');
            const { default: ServerConfig } = await import('../config/ServerConfig.ts');
            const app = await createApp();

            await request(app.getHttpServer())
                .post(ServerConfig.currentConfig?.apiPath as string)
                .send({
                    operationName: 'GenerateApplicationAiSummary',
                    query: GENERATE_MUTATION,
                    variables: { applicationId: 42 },
                })
                .expect(200);

            const [messages] = generateChatCompletionMock.mock.calls[0];
            const userPrompt = messages[1].content as string;
            expect(userPrompt).toContain('security: 40');
            expect(userPrompt).toContain('devops: 70');
            expect(userPrompt).toContain('ecodesign: 75');
            expect(userPrompt).toContain('accessibility: 90');
            expect(userPrompt).toContain('maintainability: 60');
            expect(userPrompt).toContain('performance: 88');

            await app.close();
        }, 15000);

        it('requests a structured JSON completion and stores the parsed bullets and score', async () => {
            getApplicationDetailsInfoByParamsMock.mockResolvedValue({ _id: 42, name: 'Vitality' });
            generateChatCompletionMock.mockResolvedValue({
                content: JSON.stringify({
                    bullets: ['First point', 'Second point'],
                    score: 8,
                }),
                model: 'gpt-4o-mini',
                tokensUsed: 120,
            });
            upsertMock.mockResolvedValue({
                _id: 4,
                appId: 42,
                summary: 'First point\nSecond point',
                score: 8,
                model: 'gpt-4o-mini',
            });

            const { createApp } = await import('../app.ts');
            const { default: ServerConfig } = await import('../config/ServerConfig.ts');
            const app = await createApp();

            await request(app.getHttpServer())
                .post(ServerConfig.currentConfig?.apiPath as string)
                .send({
                    operationName: 'GenerateApplicationAiSummary',
                    query: GENERATE_MUTATION,
                    variables: { applicationId: 42 },
                })
                .expect(200);

            const [, options] = generateChatCompletionMock.mock.calls[0];
            expect(options?.responseFormat).toBeDefined();
            expect(upsertMock).toHaveBeenCalledWith(
                expect.objectContaining({ summary: 'First point\nSecond point', score: 8 }),
            );

            await app.close();
        }, 15000);

        it('still generates a summary when the application has no audit run yet', async () => {
            getApplicationDetailsInfoByParamsMock.mockResolvedValue({ _id: 42, name: 'Vitality' });
            getAuditListByPageAndParamsMock.mockResolvedValue([]);
            generateChatCompletionMock.mockResolvedValue({
                content: 'Synthesis without audit data',
                model: 'gpt-4o-mini',
                tokensUsed: 90,
            });
            upsertMock.mockResolvedValue({
                _id: 3,
                appId: 42,
                summary: 'Synthesis without audit data',
                model: 'gpt-4o-mini',
            });

            const { createApp } = await import('../app.ts');
            const { default: ServerConfig } = await import('../config/ServerConfig.ts');
            const app = await createApp();

            const response = await request(app.getHttpServer())
                .post(ServerConfig.currentConfig?.apiPath as string)
                .send({
                    operationName: 'GenerateApplicationAiSummary',
                    query: GENERATE_MUTATION,
                    variables: { applicationId: 42 },
                })
                .expect(200);

            const [messages] = generateChatCompletionMock.mock.calls[0];
            expect(messages[1].content).toContain('no audit data available');
            expect(response.body.data.generateApplicationAiSummary).toEqual(
                expect.objectContaining({ success: true }),
            );

            await app.close();
        }, 15000);

        it('returns a graceful failure when the application is not found', async () => {
            getApplicationDetailsInfoByParamsMock.mockResolvedValue(null);

            const { createApp } = await import('../app.ts');
            const { default: ServerConfig } = await import('../config/ServerConfig.ts');
            const app = await createApp();

            const response = await request(app.getHttpServer())
                .post(ServerConfig.currentConfig?.apiPath as string)
                .send({
                    operationName: 'GenerateApplicationAiSummary',
                    query: GENERATE_MUTATION,
                    variables: { applicationId: 42 },
                })
                .expect(200);

            expect(generateChatCompletionMock).not.toHaveBeenCalled();
            expect(response.body.data.generateApplicationAiSummary).toEqual(
                expect.objectContaining({ success: false, report: null }),
            );

            await app.close();
        }, 15000);

        it('returns a graceful failure instead of crashing when the LLM call fails', async () => {
            getApplicationDetailsInfoByParamsMock.mockResolvedValue({ _id: 42, name: 'Vitality' });
            generateChatCompletionMock.mockRejectedValue(new Error('LiteLLM request timed out'));

            const { createApp } = await import('../app.ts');
            const { default: ServerConfig } = await import('../config/ServerConfig.ts');
            const app = await createApp();

            const response = await request(app.getHttpServer())
                .post(ServerConfig.currentConfig?.apiPath as string)
                .send({
                    operationName: 'GenerateApplicationAiSummary',
                    query: GENERATE_MUTATION,
                    variables: { applicationId: 42 },
                })
                .expect(200);

            expect(upsertMock).not.toHaveBeenCalled();
            expect(response.body.data.generateApplicationAiSummary).toEqual(
                expect.objectContaining({
                    success: false,
                    message: 'LiteLLM request timed out',
                    report: null,
                }),
            );

            await app.close();
        }, 15000);

        it('rejects users without access to the application', async () => {
            validateCredentialsMock.mockResolvedValue({ role: 'USER', applications: [1] });

            const { createApp } = await import('../app.ts');
            const { default: ServerConfig } = await import('../config/ServerConfig.ts');
            const app = await createApp();

            const response = await request(app.getHttpServer())
                .post(ServerConfig.currentConfig?.apiPath as string)
                .send({
                    operationName: 'GenerateApplicationAiSummary',
                    query: GENERATE_MUTATION,
                    variables: { applicationId: 42 },
                })
                .expect(200);

            expect(generateChatCompletionMock).not.toHaveBeenCalled();
            expect(response.body.data.generateApplicationAiSummary).toEqual(
                expect.objectContaining({ success: false, report: null }),
            );

            await app.close();
        }, 15000);
    });

    describe('getApplicationAiSummaryByParams query', () => {
        it('returns the cached summary for the application', async () => {
            getByAppIdMock.mockResolvedValue({ _id: 1, appId: 42, summary: 'Cached synthesis' });

            const { createApp } = await import('../app.ts');
            const { default: ServerConfig } = await import('../config/ServerConfig.ts');
            const app = await createApp();

            const response = await request(app.getHttpServer())
                .post(ServerConfig.currentConfig?.apiPath as string)
                .send({
                    operationName: 'GetApplicationAiSummaryByParams',
                    query: GET_QUERY,
                    variables: { _id: 42 },
                })
                .expect(200);

            expect(response.body.data.getApplicationAiSummaryByParams).toEqual(
                expect.objectContaining({ appId: 42, summary: 'Cached synthesis' }),
            );

            await app.close();
        }, 15000);

        it('returns null when no summary has ever been generated', async () => {
            getByAppIdMock.mockResolvedValue(null);

            const { createApp } = await import('../app.ts');
            const { default: ServerConfig } = await import('../config/ServerConfig.ts');
            const app = await createApp();

            const response = await request(app.getHttpServer())
                .post(ServerConfig.currentConfig?.apiPath as string)
                .send({
                    operationName: 'GetApplicationAiSummaryByParams',
                    query: GET_QUERY,
                    variables: { _id: 42 },
                })
                .expect(200);

            expect(response.body.data.getApplicationAiSummaryByParams).toBeNull();

            await app.close();
        }, 15000);
    });
});
