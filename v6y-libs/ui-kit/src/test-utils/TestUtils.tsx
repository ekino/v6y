'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render } from '@testing-library/react';
import { ReactNode } from 'react';

export const renderWithQueryClientProvider = (children: ReactNode): RenderResult => {
    const browserQueryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

    // Some libraries access internal client properties; ensure the property exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (browserQueryClient as any).defaultMutationOptions !== 'function') {
        // provide a no-op function that returns an empty options object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (browserQueryClient as any).defaultMutationOptions = (() => ({})) as any;
    }
    return render(
        <QueryClientProvider client={browserQueryClient}>{children}</QueryClientProvider>,
    );
};
