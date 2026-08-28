import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const validateCredentialsMock = vi.fn();
const getAccountNotificationSettingsMock = vi.fn();
const updateAccountNotificationSettingsMock = vi.fn();

vi.mock('@v6y/core-logic', async () => {
    const actual = await vi.importActual<typeof import('@v6y/core-logic')>('@v6y/core-logic');

    return {
        ...actual,
        validateCredentials: validateCredentialsMock,
        AccountProvider: {
            ...actual.AccountProvider,
            getAccountNotificationSettings: getAccountNotificationSettingsMock,
            updateAccountNotificationSettings: updateAccountNotificationSettingsMock,
        },
    };
});

const SETTINGS_QUERY = `
    query getCurrentAccountNotificationSettings {
        getCurrentAccountNotificationSettings {
            _id
            auditReportEmailsEnabled
            dailyDigestEmailsEnabled
        }
    }
`;

const SETTINGS_MUTATION = `
    mutation UpdateAccountNotificationSettings($input: AccountNotificationSettingsInput!) {
        updateAccountNotificationSettings(input: $input) {
            _id
            auditReportEmailsEnabled
            dailyDigestEmailsEnabled
        }
    }
`;

describe('Account notification settings', () => {
    let app: INestApplication;
    let apiPath: string;

    beforeAll(async () => {
        process.env.V6Y_BFF_API_PATH = '/v6y/graphql/';
        validateCredentialsMock.mockResolvedValue({ _id: 3, role: 'USER', applications: [42] });

        const { createApp } = await import('../app.ts');
        const { default: ServerConfig } = await import('../config/ServerConfig.ts');

        app = await createApp();
        apiPath = ServerConfig.currentConfig?.apiPath as string;
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        validateCredentialsMock.mockResolvedValue({ _id: 3, role: 'USER', applications: [42] });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const postGraphQL = (body: Record<string, unknown>): Promise<{ body: Record<string, never> }> =>
        request(app.getHttpServer()).post(apiPath).send(body).expect(200);

    it('reads the preferences of the authenticated account', async () => {
        getAccountNotificationSettingsMock.mockResolvedValue({
            _id: 3,
            auditReportEmailsEnabled: true,
            dailyDigestEmailsEnabled: false,
        });

        const response = await postGraphQL({
            operationName: 'getCurrentAccountNotificationSettings',
            query: SETTINGS_QUERY,
            variables: {},
        });

        expect(getAccountNotificationSettingsMock).toHaveBeenCalledWith({ _id: 3 });
        expect(response.body).toMatchObject({
            data: {
                getCurrentAccountNotificationSettings: {
                    _id: 3,
                    auditReportEmailsEnabled: true,
                    dailyDigestEmailsEnabled: false,
                },
            },
        });
    });

    it('updates the preferences of the authenticated account, ignoring any other id', async () => {
        updateAccountNotificationSettingsMock.mockResolvedValue({
            _id: 3,
            auditReportEmailsEnabled: false,
            dailyDigestEmailsEnabled: true,
        });

        await postGraphQL({
            operationName: 'UpdateAccountNotificationSettings',
            query: SETTINGS_MUTATION,
            variables: { input: { auditReportEmailsEnabled: false } },
        });

        expect(updateAccountNotificationSettingsMock).toHaveBeenCalledWith({
            _id: 3,
            auditReportEmailsEnabled: false,
            dailyDigestEmailsEnabled: undefined,
        });
    });
});
