import { HttpResponse, graphql } from 'msw';

export const handlers = [
    graphql.query('LoginAccount', ({ variables }) => {
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
];
