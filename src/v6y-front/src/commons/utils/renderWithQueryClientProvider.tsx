import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';

export default function renderWithQueryClientProvider(children: ReactNode) {
    const browserQueryClient = new QueryClient();
    return render(
        <QueryClientProvider client={browserQueryClient}>{children}</QueryClientProvider>,
    );
}
