import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render } from '@testing-library/react';
import { ReactNode } from 'react';

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

/**
 * Render a page with common providers and cleanup
 */
export const renderWithProviders = (ui: ReactNode, options?: RenderPageOptions): RenderResult => {
    const queryClient = options?.queryClient || createTestQueryClient();

    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

