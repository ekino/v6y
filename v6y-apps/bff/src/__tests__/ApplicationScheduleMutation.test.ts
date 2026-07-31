import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const validateCredentialsMock = vi.fn();
const editFormApplicationMock = vi.fn();
const deleteApplicationMock = vi.fn();

vi.mock('@v6y/core-logic', async () => {
    const actual = await vi.importActual<typeof import('@v6y/core-logic')>('@v6y/core-logic');

    return {
        ...actual,
        validateCredentials: validateCredentialsMock,
        ApplicationProvider: {
            ...actual.ApplicationProvider,
            editFormApplication: editFormApplicationMock,
            deleteApplication: deleteApplicationMock,
        },
    };
});

const SCHEDULE_URL = 'http://localhost:4002/v6y/bfb-main/schedule-application-analysis.json';

const EDIT_MUTATION = `
    mutation CreateOrEditApplication($applicationInput: ApplicationCreateOrEditInput!) {
        createOrEditApplication(applicationInput: $applicationInput) {
            _id
            auditFrequencyScheduled
        }
    }
`;

const APPLICATION_INPUT = {
    _id: 42,
    acronym: 'TA',
    name: 'TestApp',
    description: 'Test Application',
    gitWebUrl: 'https://testrepo.com',
    gitUrl: 'https://git.testrepo.com',
    productionLink: 'https://testapp.com',
    contactMail: 'test@example.com',
    auditFrequencyEnabled: true,
    auditFrequencyCron: '0 */6 * * *',
};

const postGraphQL = async (
    body: Record<string, unknown>,
): Promise<{ body: Record<string, never> }> => {
    const { createApp } = await import('../app.ts');
    const { default: ServerConfig } = await import('../config/ServerConfig.ts');

    const app = await createApp();

    try {
        return await request(app.getHttpServer())
            .post(ServerConfig.currentConfig?.apiPath as string)
            .send(body)
            .expect(200);
    } finally {
        await app.close();
    }
};

describe('createOrEditApplication scheduling', () => {
    beforeEach(() => {
        process.env.V6Y_BFF_API_PATH = '/v6y/graphql/';
        process.env.V6Y_MAIN_ANALYZER_SCHEDULE_API_PATH = SCHEDULE_URL;
        validateCredentialsMock.mockResolvedValue({ role: 'ADMIN', applications: [42] });
        editFormApplicationMock.mockResolvedValue({ _id: 42 });
        deleteApplicationMock.mockResolvedValue({ _id: 42 });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
        vi.resetModules();
        delete process.env.V6Y_INTERNAL_API_SECRET;
    });

    it('should report a successful schedule installation', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({ success: true }),
            }),
        );

        const response = await postGraphQL({
            operationName: 'CreateOrEditApplication',
            query: EDIT_MUTATION,
            variables: { applicationInput: APPLICATION_INPUT },
        });

        expect(fetch).toHaveBeenCalledWith(
            SCHEDULE_URL,
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    applicationId: 42,
                    cron: '0 */6 * * *',
                    enabled: true,
                }),
            }),
        );
        expect(response.body).toEqual({
            data: { createOrEditApplication: { _id: 42, auditFrequencyScheduled: true } },
        });
    }, 15000);

    it('should still save the application but report that the schedule was not applied', async () => {
        // The application row is already written when the analyzer call fails, so
        // reporting a plain success here is what used to hide a schedule that was
        // enabled in the database and installed nowhere.
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => ({ message: 'The application analysis queue is unavailable.' }),
            }),
        );

        const response = await postGraphQL({
            operationName: 'CreateOrEditApplication',
            query: EDIT_MUTATION,
            variables: { applicationInput: APPLICATION_INPUT },
        });

        expect(editFormApplicationMock).toHaveBeenCalled();
        expect(response.body).toEqual({
            data: { createOrEditApplication: { _id: 42, auditFrequencyScheduled: false } },
        });
    }, 15000);

    it('should report a failure when the schedule API path is not configured', async () => {
        delete process.env.V6Y_MAIN_ANALYZER_SCHEDULE_API_PATH;
        vi.stubGlobal('fetch', vi.fn());

        const response = await postGraphQL({
            operationName: 'CreateOrEditApplication',
            query: EDIT_MUTATION,
            variables: { applicationInput: APPLICATION_INPUT },
        });

        expect(fetch).not.toHaveBeenCalled();
        expect(response.body).toEqual({
            data: { createOrEditApplication: { _id: 42, auditFrequencyScheduled: false } },
        });
    }, 15000);

    it('should send the internal secret header when one is configured', async () => {
        process.env.V6Y_INTERNAL_API_SECRET = 'a-shared-secret';
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) }),
        );

        await postGraphQL({
            operationName: 'CreateOrEditApplication',
            query: EDIT_MUTATION,
            variables: { applicationInput: APPLICATION_INPUT },
        });

        expect(fetch).toHaveBeenCalledWith(
            SCHEDULE_URL,
            expect.objectContaining({
                headers: {
                    'Content-Type': 'application/json',
                    'x-v6y-internal-secret': 'a-shared-secret',
                },
            }),
        );
    }, 15000);

    it('should remove the schedule of a deleted application', async () => {
        // Without this the job scheduler survives the row and keeps enqueuing
        // analyses for an application the analyzer can no longer find.
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) }),
        );

        const response = await postGraphQL({
            operationName: 'DeleteApplication',
            query: `
                mutation DeleteApplication($input: ApplicationDeleteInput!) {
                    deleteApplication(input: $input) {
                        _id
                    }
                }
            `,
            variables: { input: { id: '42' } },
        });

        expect(fetch).toHaveBeenCalledWith(
            SCHEDULE_URL,
            expect.objectContaining({
                body: JSON.stringify({ applicationId: 42, cron: null, enabled: false }),
            }),
        );
        expect(deleteApplicationMock).toHaveBeenCalledWith({ _id: 42 });
        expect(response.body).toEqual({ data: { deleteApplication: { _id: 42 } } });
    }, 15000);
});
