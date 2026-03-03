import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import VitalityDashboardView from '../../features/dashboard/components/VitalityDashboardView';

// Mock VitalityAppList component
vi.mock('../../features/app-list/components/VitalityAppList', () => ({
    __esModule: true,
    default: ({ source }: { source: string }) => (
        <div data-testid="mock-app-list" data-source={source}>
            Mock App List
        </div>
    ),
}));

describe('VitalityDashboardView', () => {
    it('renders app list with search source', () => {
        const qc = new QueryClient();
        render(
            <QueryClientProvider client={qc}>
                <VitalityDashboardView />
            </QueryClientProvider>,
        );

        const appList = screen.getByTestId('mock-app-list');
        expect(appList).toBeInTheDocument();
        expect(appList).toHaveAttribute('data-source', 'search');
    });

    it('does not render filters (removed from dashboard)', () => {
        const qc = new QueryClient();
        render(
            <QueryClientProvider client={qc}>
                <VitalityDashboardView />
            </QueryClientProvider>,
        );

        expect(screen.queryByTestId('mock-filters')).not.toBeInTheDocument();
    });
});
