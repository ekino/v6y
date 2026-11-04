import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { validateCredentialsMock, deleteFaqMock, deleteApplicationMock, getAccountDetailsMock } =
    vi.hoisted(() => ({
        validateCredentialsMock: vi.fn(),
        deleteFaqMock: vi.fn(),
        deleteApplicationMock: vi.fn(),
        getAccountDetailsMock: vi.fn(),
    }));

vi.mock('@v6y/core-logic', async () => {
    const actual = await vi.importActual<typeof import('@v6y/core-logic')>('@v6y/core-logic');

    return {
        ...actual,
        validateCredentials: validateCredentialsMock,
        FaqProvider: { ...actual.FaqProvider, deleteFaq: deleteFaqMock },
        ApplicationProvider: {
            ...actual.ApplicationProvider,
            deleteApplication: deleteApplicationMock,
        },
        AccountProvider: {
            ...actual.AccountProvider,
            getAccountDetailsByParams: getAccountDetailsMock,
        },
    };
});

const post = async (body: object) => {
    const { createApp } = await import('../app.ts');
    const { default: ServerConfig } = await import('../config/ServerConfig.ts');
    const app = await createApp();

    return request(app.getHttpServer())
        .post(ServerConfig.currentConfig?.apiPath as string)
        .send(body);
};

const DELETE_FAQ = 'deleteFaq(input: { id: "7" }) { _id }';

describe('BFF authorization boundary', () => {
    beforeEach(() => {
        process.env.V6Y_BFF_API_PATH = '/v6y/graphql/';
        validateCredentialsMock.mockResolvedValue(null);
        deleteFaqMock.mockResolvedValue(undefined);
        deleteApplicationMock.mockResolvedValue(undefined);
        getAccountDetailsMock.mockResolvedValue(null);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
        vi.resetModules();
    });

    describe('anonymous requests', () => {
        it('cannot run a mutation by naming its operation LoginAccount', async () => {
            const response = await post({
                operationName: 'LoginAccount',
                query: `mutation LoginAccount { ${DELETE_FAQ} }`,
            });

            expect(deleteFaqMock).not.toHaveBeenCalled();
            expect(JSON.stringify(response.body)).toContain('Unauthorized User');
        });

        it('cannot run a mutation by naming its operation IntrospectionQuery', async () => {
            await post({
                operationName: 'IntrospectionQuery',
                query: `mutation IntrospectionQuery { ${DELETE_FAQ} }`,
            });

            expect(deleteFaqMock).not.toHaveBeenCalled();
        });

        it('cannot hide a protected field behind a loginAccount alias', async () => {
            await post({
                operationName: 'LoginAccount',
                query: `mutation LoginAccount { loginAccount: ${DELETE_FAQ} }`,
            });

            expect(deleteFaqMock).not.toHaveBeenCalled();
        });

        it('cannot add a protected field next to loginAccount', async () => {
            const response = await post({
                operationName: 'LoginAccount',
                query: `query LoginAccount {
                    loginAccount(input: { email: "a@b.c", password: "x" }) { token }
                    getFaqListByPageAndParams { _id }
                }`,
            });

            expect(JSON.stringify(response.body)).toContain('Unauthorized User');
        });

        it('can still log in without credentials', async () => {
            const response = await post({
                operationName: 'LoginAccount',
                query: `query LoginAccount($input: AccountLoginInput!) {
                    loginAccount(input: $input) { token }
                }`,
                variables: { input: { email: 'a@b.c', password: 'x' } },
            });

            expect(validateCredentialsMock).not.toHaveBeenCalled();
            expect(getAccountDetailsMock).toHaveBeenCalledWith({ email: 'a@b.c' });
            expect(response.body).toEqual({ data: { loginAccount: null } });
        });

        it('can still run an introspection query', async () => {
            const response = await post({
                operationName: 'IntrospectionQuery',
                query: 'query IntrospectionQuery { __schema { queryType { name } } }',
            });

            expect(validateCredentialsMock).not.toHaveBeenCalled();
            expect(response.body.data.__schema.queryType.name).toBe('Query');
        });
    });

    describe('back-office mutations', () => {
        it('are refused to a member account', async () => {
            validateCredentialsMock.mockResolvedValue({ _id: 3, role: 'USER', applications: [7] });

            const faq = await post({ query: `mutation { ${DELETE_FAQ} }` });
            const app = await post({
                query: 'mutation { deleteApplication(input: { id: "7" }) { _id } }',
            });

            expect(deleteFaqMock).not.toHaveBeenCalled();
            expect(deleteApplicationMock).not.toHaveBeenCalled();
            expect(faq.body.data).toEqual({ deleteFaq: null });
            expect(app.body.data).toEqual({ deleteApplication: null });
            expect(faq.body.errors[0].message).toMatch(/forbidden/i);
        });

        it('are allowed to an admin account', async () => {
            validateCredentialsMock.mockResolvedValue({ _id: 1, role: 'ADMIN' });

            const response = await post({ query: `mutation { ${DELETE_FAQ} }` });

            expect(deleteFaqMock).toHaveBeenCalledWith({ _id: 7 });
            expect(response.body).toEqual({ data: { deleteFaq: { _id: 7 } } });
        });

        it('are allowed to a superadmin account', async () => {
            validateCredentialsMock.mockResolvedValue({ _id: 1, role: 'SUPERADMIN' });

            await post({ query: 'mutation { deleteApplication(input: { id: "7" }) { _id } }' });

            expect(deleteApplicationMock).toHaveBeenCalledWith({ _id: 7 });
        });
    });
});
