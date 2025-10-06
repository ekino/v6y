'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';

export const renderWithQueryClientProvider = (children: ReactNode) => {
    const browserQueryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
                staleTime: 5 * 60 * 1000, // 5 minutes
            },
            mutations: {
                retry: false,
            },
        },
    });

    return render(
        <QueryClientProvider client={browserQueryClient}>{children}</QueryClientProvider>,
    );
};
