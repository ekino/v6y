import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, RenderResult, render } from '@testing-library/react';
import * as React from 'react';

export const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

export const renderWithProviders = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult => {
    const queryClient = createTestQueryClient();
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>, options);
};
