/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import VitalityDashboardView from '../../features/dashboard/components/VitalityDashboardView';

vi.mock('../../../commons/config/VitalityCommonConfig', () => ({
    buildDashboardMenuItems: vi.fn(() => [
        { title: 'Dashboard Item 1', url: '/item1', avatar: '📌', avatarColor: 'red' },
        { title: 'Dashboard Item 2', url: '/item2', avatar: '⚡', avatarColor: 'blue' },
    ]),
}));

vi.mock('../../../commons/components/VitalitySearchBar', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-search-bar">Mock Search Bar</div>,
}));

vi.mock('../../features/dashboard/components/VitalityDashboardMenu', () => ({
    __esModule: true,
    default: ({ options }: { options: any[] }) => (
        <div data-testid="mock-dashboard-menu">
            {options.map((option) => (
                <div key={option.title} data-testid="mock-menu-item">
                    {option.title}
                </div>
            ))}
        </div>
    ),
}));

describe('VitalityDashboardView', () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    const renderWithQueryClient = (component: React.ReactElement) => {
        return render(
            <QueryClientProvider client={queryClient}>
                {component}
            </QueryClientProvider>
        );
    };

    it('renders the search bar', () => {
        renderWithQueryClient(<VitalityDashboardView />);
        expect(screen.getByText('vitality.dashboardPage.searchByProjectName :')).toBeInTheDocument();
        expect(screen.getByText('vitality.searchPage.inputHelper')).toBeInTheDocument();
        expect(screen.getByTestId('mock-search-input')).toBeInTheDocument();
    });

    it('renders the dashboard menu with items', () => {
        renderWithQueryClient(<VitalityDashboardView />);
        expect(screen.getByTestId('mock-dashboard-menu')).toBeInTheDocument();
        expect(screen.getAllByTestId('mock-menu-item')).toHaveLength(5);
        expect(screen.getAllByTestId('mock-menu-item')[0]).toHaveTextContent('React');
        expect(screen.getAllByTestId('mock-menu-item')[1]).toHaveTextContent('Angular');
        expect(screen.getAllByTestId('mock-menu-item')[2]).toHaveTextContent('React Legacy');
        expect(screen.getAllByTestId('mock-menu-item')[3]).toHaveTextContent('Angular Legacy');
        expect(screen.getAllByTestId('mock-menu-item')[4]).toHaveTextContent('Health statistics');
    });
});
