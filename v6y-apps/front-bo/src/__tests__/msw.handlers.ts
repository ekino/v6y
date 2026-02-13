import { HttpResponse, graphql } from 'msw';

/**
 * MSW GraphQL handlers for API mocking
 * Replaces the previous vitest mocks with more reliable MSW handlers
 */

// Mock responses for GraphQL operations
export const mockGraphQLResponses = {
    loginSuccess: {
        login: {
            data: {
                id: 'user-123',
                email: 'test@example.com',
                name: 'Test User',
            },
            token: 'mock-jwt-token',
        },
    },
    loginError: {
        error: 'Invalid credentials',
    },
    applicationsList: {
        applications: {
            data: [
                {
                    _id: 'app-1',
                    name: 'Application 1',
                    status: 'active',
                    version: '1.0.0',
                },
                {
                    _id: 'app-2',
                    name: 'Application 2',
                    status: 'active',
                    version: '2.0.0',
                },
            ],
            total: 2,
        },
    },
    accountsList: {
        accounts: {
            data: [
                {
                    _id: 'account-1',
                    name: 'Account 1',
                    email: 'account1@example.com',
                },
                {
                    _id: 'account-2',
                    name: 'Account 2',
                    email: 'account2@example.com',
                },
            ],
            total: 2,
        },
    },
    auditReports: {
        auditReports: {
            data: [
                {
                    _id: 'report-1',
                    applicationId: 'app-1',
                    status: 'completed',
                    score: 85,
                },
            ],
            total: 1,
        },
    },
    empty: {
        data: [],
    },
};

/**
 * GraphQL handlers for MSW
 * Define handlers for each GraphQL operation used in tests
 */
export const handlers = [
    // LoginAccount query
    graphql.query('LoginAccount', ({ variables }) => {
        // You can add logic here to handle different scenarios based on variables
        if (variables?.input?.email === 'error@example.com') {
            return HttpResponse.json({
                errors: [{ message: 'Invalid credentials' }],
            });
        }

        return HttpResponse.json({
            data: {
                loginAccount: {
                    _id: 'user-123',
                    role: 'admin',
                    token: 'mock-jwt-token',
                    username: 'testuser',
                },
            },
        });
    }),

    // GetApplications query
    graphql.query('GetApplications', () => {
        return HttpResponse.json({
            data: {
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
        });
    }),

    // GetAccounts query (placeholder - update based on actual schema)
    graphql.query('GetAccounts', () => {
        return HttpResponse.json({
            data: {
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
        });
    }),

    // GetAuditReports query (placeholder - update based on actual schema)
    graphql.query('GetAuditReports', () => {
        return HttpResponse.json({
            data: {
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
        });
    }),

    // TriggerApplicationAnalysis mutation
    graphql.mutation('TriggerApplicationAnalysis', ({ variables }) => {
        return HttpResponse.json({
            data: {
                triggerApplicationAnalysis: {
                    success: true,
                    message: 'Analysis triggered successfully',
                    applicationId: variables?.input?.applicationId || 'app-1',
                    branch: variables?.input?.branch || 'main',
                },
            },
        });
    }),

    // Add more handlers as needed for other GraphQL operations
];

/**
 * Setup function to configure MSW with custom handlers
 * Useful for tests that need specific mock responses
 */
export const setupMSWHandlers = (customHandlers: typeof handlers = handlers) => {
    return customHandlers;
};

/**
 * Helper to create error responses
 */
export const createGraphQLError = (message: string) => {
    return HttpResponse.json({
        errors: [{ message }],
    });
};

/**
 * Helper to create success responses
 */
export const createGraphQLSuccess = (data: Record<string, unknown>) => {
    return HttpResponse.json({
        data,
    });
};
