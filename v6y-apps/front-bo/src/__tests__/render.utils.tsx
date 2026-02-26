import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render } from '@testing-library/react';
import { ReactNode } from 'react';
import { vi } from 'vitest';

/**
 * Custom render function that provides essential providers for front-bo pages
 * Includes: QueryClientProvider and mocks for navigation
 */
export interface RenderPageOptions {
    queryClient?: QueryClient;
    mockNavigation?: boolean;
    initialPath?: string;
}

const createTestQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
                staleTime: Infinity,
            },
            mutations: {
                retry: false,
            },
        },
    });
};

export const renderPage = (
    ui: ReactNode,
    {
        queryClient = createTestQueryClient(),
        mockNavigation = true,
        initialPath = '/',
    }: RenderPageOptions = {},
): RenderResult => {
    // Mock next/navigation if needed
    if (mockNavigation) {
        vi.mock('next/navigation', () => ({
            useRouter: () => ({
                push: vi.fn(),
                replace: vi.fn(),
                back: vi.fn(),
                forward: vi.fn(),
                refresh: vi.fn(),
                prefetch: vi.fn(),
            }),
            usePathname: () => initialPath,
            useSearchParams: () => new URLSearchParams(),
        }));
    }

    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

/**
 * Render a page with common providers and cleanup
 */
export const renderWithProviders = (ui: ReactNode, options?: RenderPageOptions): RenderResult => {
    const queryClient = options?.queryClient || createTestQueryClient();

    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

/**
 * Create a test queryClient that can be reused across tests
 */
export const createMockQueryClient = () => {
    return createTestQueryClient();
};
