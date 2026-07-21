import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { Mock, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityDashboardReportsChart from '../../features/dashboard/components/VitalityDashboardReportsChart';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
    buildClientQuery: vi.fn(),
}));

beforeAll(() => {
    vi.stubGlobal(
        'ResizeObserver',
        class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('VitalityDashboardReportsChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders a skeleton while loading', () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: true,
            data: undefined,
        });

        const { container } = render(
            <TestWrapper>
                <VitalityDashboardReportsChart />
            </TestWrapper>,
        );

        expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
    });

    it('shows a friendly empty state with a call to action when there are no audit runs', () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getAllAuditRuns: [] },
        });

        render(
            <TestWrapper>
                <VitalityDashboardReportsChart />
            </TestWrapper>,
        );

        expect(
            screen.getByText('vitality.dashboardPage.reportsTrendEmptyTitle'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('vitality.dashboardPage.reportsTrendEmptyDescription'),
        ).toBeInTheDocument();

        const cta = screen.getByText('vitality.dashboardPage.reportsTrendEmptyCta');
        expect(cta.closest('a')).toHaveAttribute('href', '/app-list');
    });

    it('renders the chart with only the analysis categories that have activity', () => {
        const now = new Date();
        const recent = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getAllAuditRuns: [
                    { triggeredAt: recent, analysisTypes: ['static', 'dynamic'] },
                    { triggeredAt: recent, analysisTypes: ['static'] },
                ],
            },
        });

        const { container } = render(
            <TestWrapper>
                <VitalityDashboardReportsChart />
            </TestWrapper>,
        );

        expect(
            screen.queryByText('vitality.dashboardPage.reportsTrendEmptyTitle'),
        ).not.toBeInTheDocument();
        expect(
            screen.getByText('vitality.dashboardPage.reportsTrendLegendStatic'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('vitality.dashboardPage.reportsTrendLegendDynamic'),
        ).toBeInTheDocument();
        expect(
            screen.queryByText('vitality.dashboardPage.reportsTrendLegendDevops'),
        ).not.toBeInTheDocument();
        expect(container.querySelector('.recharts-responsive-container')).not.toBeNull();
    });
});
