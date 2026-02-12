import { vi } from 'vitest';

/**
 * Mock utility for API calls using graphql-request
 * This provides consistent mocking across all tests
 */

export const mockGraphQLClient = {
    request: vi.fn(),
    query: vi.fn(),
    mutation: vi.fn(),
};

/**
 * Mock responses for common API calls
 */
export const mockApiResponses = {
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
 * Setup mock for API client
 * Usage: setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess)
 */
export const setupMockApiClient = (
    mockClient: typeof mockGraphQLClient,
    response: Record<string, unknown>,
) => {
    mockClient.request.mockResolvedValue(response);
    mockClient.query.mockResolvedValue(response);
    mockClient.mutation.mockResolvedValue(response);
    return mockClient;
};

/**
 * Reset all mock API calls
 */
export const resetMockApiClient = () => {
    mockGraphQLClient.request.mockReset();
    mockGraphQLClient.query.mockReset();
    mockGraphQLClient.mutation.mockReset();
};

/**
 * Mock fetch for simple REST API calls
 */
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

/**
 * Mock fetch error
 */
export const mockFetchError = (error: string) => {
    global.fetch = vi.fn(() => Promise.reject(new Error(error)));
};
