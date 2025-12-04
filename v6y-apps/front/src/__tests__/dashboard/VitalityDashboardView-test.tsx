/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import VitalityDashboardView from '../../features/dashboard/components/VitalityDashboardView';

// Mock child components used by VitalityDashboardView
vi.mock('../../features/dashboard/components/VitalityDashboardFilters', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-filters">Mock Filters</div>,
}));

vi.mock('../../features/app-list/components/VitalityAppList', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-app-list">Mock App List</div>,
}));

describe('VitalityDashboardView', () => {
    it('renders filters and app list', () => {
        const qc = new QueryClient();
        render(
            <QueryClientProvider client={qc}>
                <VitalityDashboardView />
            </QueryClientProvider>,
        );

        expect(screen.getByTestId('mock-filters')).toBeInTheDocument();
        expect(screen.getByTestId('mock-app-list')).toBeInTheDocument();
    });
});
