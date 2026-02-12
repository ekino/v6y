/**
 * Enhanced test setup for API mocking
 * This file extends the base setupTests.tsx with additional GraphQL and AuthAPI mocks
 *
 * Import this in vitest.config.mjs setupFiles alongside vitest.setup.ts
 */
import React from 'react';
import { vi } from 'vitest';

/**
 * Mock GraphQL request client
 * Used for all GraphQL API calls in the app
 */
export const mockGraphQLRequest = vi.fn();

/**
 * Mock Next.js server functions
 */
vi.mock('next/headers', () => ({
    cookies: vi.fn(async () => ({
        get: vi.fn((name: string) => {
            if (name === 'auth') {
                return { value: 'mock-auth-token' };
            }
            return undefined;
        }),
        set: vi.fn(),
        delete: vi.fn(),
    })),
    headers: vi.fn(() => ({
        get: vi.fn(),
    })),
}));

/**
 * Mock GraphQL client (graphql-request)
 */
vi.mock('graphql-request', () => ({
    GraphQLClient: vi.fn(() => ({
        request: mockGraphQLRequest,
        query: vi.fn((query: string, variables?: Record<string, unknown>) =>
            mockGraphQLRequest(query, variables),
        ),
        mutation: vi.fn((mutation: string, variables?: Record<string, unknown>) =>
            mockGraphQLRequest(mutation, variables),
        ),
    })),
    gql: vi.fn((str: string) => str),
    rawRequest: vi.fn(),
}));

/**
 * Mock refinedev hooks
 */
vi.mock('@refinedev/core', () => ({
    useList: vi.fn(() => ({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
    })),
    useCreate: vi.fn(() => ({
        mutate: vi.fn(),
        isLoading: false,
        isSuccess: false,
    })),
    useUpdate: vi.fn(() => ({
        mutate: vi.fn(),
        isLoading: false,
        isSuccess: false,
    })),
    useDelete: vi.fn(() => ({
        mutate: vi.fn(),
        isLoading: false,
        isSuccess: false,
    })),
    useOne: vi.fn(() => ({
        data: null,
        isLoading: false,
        error: null,
    })),
}));

/**
 * Mock i18next
 */
vi.mock('react-i18next', () => ({
    useTranslation: vi.fn(() => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn(),
            language: 'en',
        },
    })),
    I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

/**
 * Mock next/navigation for testing
 */
if (typeof window !== 'undefined') {
    vi.mock('next/navigation', () => ({
        useRouter: () => ({
            push: vi.fn(),
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            prefetch: vi.fn(),
        }),
        usePathname: () => '/',
        useSearchParams: () => new URLSearchParams(),
        useParams: () => ({}),
    }));
}

export {};
