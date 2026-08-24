import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('Account notification settings', () => {
    beforeEach(() => {
        process.env.V6Y_BFF_API_PATH = '/v6y/graphql/';
        validateCredentialsMock.mockResolvedValue({ _id: 3, role: 'USER', applications: [42] });
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

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
