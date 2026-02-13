import { HttpResponse, graphql } from 'msw';
import { vi } from 'vitest';

export { graphql, HttpResponse } from 'msw';

export const mockApiResponses = {
    loginSuccess: {
        loginAccount: {
            _id: 'user-123',
            role: 'admin',
            token: 'mock-jwt-token',
            username: 'testuser',
            email: 'testuser@example.com',
        },
    },
    loginError: {
        error: 'Invalid credentials',
    },
    applicationsList: {
        getApplicationListByPageAndParams: [
            {
                _id: 'app-1',
                name: 'Application 1',
                acronym: 'APP1',
                contactMail: 'contact@app1.com',
                description: 'Test application 1',
                repo: {
                    webUrl: 'https://github.com/test/app1',
                    gitUrl: 'https://github.com/test/app1.git',
                    name: 'app1',
                    organization: 'test',
                    allBranches: ['main', 'develop'],
                },
                configuration: {
                    dataDog: {
                        apiKey: 'test-key',
                        appKey: 'test-app-key',
                        url: 'https://app.datadoghq.com',
                        monitorId: '12345',
                    },
                },
                links: [
                    {
                        label: 'Documentation',
                        value: 'https://docs.app1.com',
                        description: 'App1 documentation',
                    },
                ],
            },
            {
                _id: 'app-2',
                name: 'Application 2',
                acronym: 'APP2',
                contactMail: 'contact@app2.com',
                description: 'Test application 2',
                repo: {
                    webUrl: 'https://github.com/test/app2',
                    gitUrl: 'https://github.com/test/app2.git',
                    name: 'app2',
                    organization: 'test',
                    allBranches: ['main'],
                },
                configuration: {
                    dataDog: null,
                },
                links: [],
            },
        ],
    },
    accountsList: {
        getAccountList: [
            {
                _id: 'account-1',
                name: 'Account 1',
                email: 'account1@example.com',
                role: 'admin',
            },
            {
                _id: 'account-2',
                name: 'Account 2',
                email: 'account2@example.com',
                role: 'user',
            },
        ],
    },
    auditReports: {
        getApplicationDetailsAuditReportsByParams: [
            {
                _id: 'report-1',
                applicationId: 'app-1',
                status: 'completed',
                score: 85,
                createdAt: '2024-01-01T00:00:00Z',
            },
        ],
    },
    triggerAnalysisSuccess: {
        triggerApplicationAnalysis: {
            success: true,
            message: 'Analysis triggered successfully',
            applicationId: 'app-1',
            branch: 'main',
        },
    },
    empty: {
        data: [],
    },
};

/**
 * Create a custom GraphQL handler for testing
 * Usage: server.use(createGraphQLHandler('Login', mockApiResponses.loginSuccess))
 */
export const createGraphQLHandler = (
    operationName: string,
    response: Record<string, unknown>,
    operationType: 'query' | 'mutation' = 'query',
) => {
    const handler = operationType === 'mutation' ? graphql.mutation : graphql.query;
    return handler(operationName, () => HttpResponse.json({ data: response }));
};

export const createGraphQLErrorHandler = (
    operationName: string,
    errorMessage: string,
    operationType: 'query' | 'mutation' = 'query',
) => {
    const handler = operationType === 'mutation' ? graphql.mutation : graphql.query;
    return handler(operationName, () =>
        HttpResponse.json({
            errors: [{ message: errorMessage }],
        }),
    );
};

export const mockFetch = (response: Record<string, unknown>, status = 200) => {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            ok: status >= 200 && status < 300,
            status,
            json: () => Promise.resolve(response),
            text: () => Promise.resolve(JSON.stringify(response)),
        } as Response),
    );
};

export const mockFetchError = (error: string) => {
    global.fetch = vi.fn(() => Promise.reject(new Error(error)));
};
