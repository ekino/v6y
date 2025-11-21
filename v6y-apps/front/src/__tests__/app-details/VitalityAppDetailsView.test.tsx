import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAppDetailsView from '../../features/app-details/components/VitalityAppDetailsView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

vi.mock('../../features/app-details/components/infos/VitalityGeneralInformationView', () => ({
    default: ({ appInfos }: { appInfos?: { name?: string } }) => (
        <div data-testid="general-information-view">
            General Information View {appInfos?.name && `- ${appInfos.name}`}
        </div>
    ),
}));

vi.mock('../../features/app-details/components/audit-reports/VitalityAuditReportsView', () => ({
    default: () => <div data-testid="audit-reports-view">Audit Reports View</div>,
}));

vi.mock(
    '../../features/app-details/components/quality-indicators/VitalityQualityIndicatorsView',
    () => ({
        default: () => <div data-testid="quality-indicators-view">Quality Indicators View</div>,
    }),
);

vi.mock('../../features/app-details/components/dependencies/VitalityDependenciesView', () => ({
    default: () => <div data-testid="dependencies-view">Dependencies View</div>,
}));

vi.mock('../../features/app-details/components/evolutions/VitalityEvolutionsView', () => ({
    default: () => <div data-testid="evolutions-view">Evolutions View</div>,
}));

vi.mock('../../features/app-details/components/summary-card/VitalitySummaryCard', () => ({
    default: ({ appInfos }: { appInfos?: { name?: string } }) => (
        <div data-testid="summary-card">Summary Card {appInfos?.name && `- ${appInfos.name}`}</div>
    ),
}));

const mockAppData = {
    getApplicationDetailsInfoByParams: {
        _id: 123,
        name: 'Test App',
        acronym: 'TA',
        repo: {
            gitUrl: 'https://github.com/test/repo',
            allBranches: ['main', 'develop'],
        },
        links: [{ label: 'Production', value: 'https://test.com' }],
        contactMail: 'test@example.com',
    },
};

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => {
    return {
        useClientQuery: vi.fn(() => ({
            isLoading: false,
            data: {
                getApplicationDetailsInfoByParams: {
                    _id: 123,
                    name: 'Test App',
                    acronym: 'TA',
                    repo: {
                        gitUrl: 'https://github.com/test/repo',
                        allBranches: ['main', 'develop'],
                    },
                    links: [{ label: 'Production', value: 'https://test.com' }],
                    contactMail: 'test@example.com',
                },
            },
        })),
        buildClientQuery: vi.fn(),
    };
});

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppDetailsDataToCSV: vi.fn(),
}));

vi.mock('../../commons/config/VitalityApiConfig', () => ({
    default: {
        VITALITY_BFF_URL: 'http://localhost:3000',
    },
}));

describe('VitalityAppDetailsView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useClientQuery).mockReturnValue({
            isLoading: false,
            data: mockAppData,
        } as unknown as ReturnType<typeof useClientQuery>);
    });

    const renderComponent = () => {
        return render(
            <TestWrapper>
                <VitalityAppDetailsView />
            </TestWrapper>,
        );
    };

    it('renders the component with all main sections', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('summary-card')).toBeInTheDocument();
        });

        expect(screen.getByRole('combobox')).toBeInTheDocument();

        expect(screen.getByDisplayValue('2025-01-01')).toBeInTheDocument();

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(4);

        expect(screen.getByText('vitality.appDetailsPage.tabs.overview')).toBeInTheDocument();
        expect(screen.getByText('vitality.appDetailsPage.tabs.performance')).toBeInTheDocument();
        expect(screen.getByText('vitality.appDetailsPage.tabs.accessibility')).toBeInTheDocument();
        expect(screen.getByText('vitality.appDetailsPage.tabs.security')).toBeInTheDocument();
        expect(
            screen.getByText('vitality.appDetailsPage.tabs.maintainability'),
        ).toBeInTheDocument();
        expect(screen.getByText('vitality.appDetailsPage.tabs.devops')).toBeInTheDocument();

        expect(screen.getByText('vitality.appDetailsPage.exportButton')).toBeInTheDocument();
    });

    it('shows Overview tab content by default', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('general-information-view')).toBeInTheDocument();
        });
    });

    it('switches tab content when clicking different tabs', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('general-information-view')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.performance'));
        await waitFor(() => {
            expect(screen.getByTestId('audit-reports-view')).toBeInTheDocument();
            expect(screen.queryByTestId('general-information-view')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.accessibility'));
        await waitFor(() => {
            expect(screen.getByTestId('quality-indicators-view')).toBeInTheDocument();
            expect(screen.queryByTestId('audit-reports-view')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.security'));
        await waitFor(() => {
            expect(screen.getByTestId('dependencies-view')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.maintainability'));
        await waitFor(() => {
            expect(screen.getByTestId('evolutions-view')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.devops'));
        await waitFor(() => {
            expect(screen.getByTestId('audit-reports-view')).toBeInTheDocument();
        });
    });

    it('applies correct CSS classes for active and inactive tabs', async () => {
        renderComponent();

        await waitFor(() => {
            const overviewTab = screen.getByText('vitality.appDetailsPage.tabs.overview');
            const performanceTab = screen.getByText('vitality.appDetailsPage.tabs.performance');

            expect(overviewTab).toHaveClass('bg-white', 'text-slate-900', 'shadow-sm');
            expect(performanceTab).toHaveClass('text-slate-700');
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.performance'));

        await waitFor(() => {
            const overviewTab = screen.getByText('vitality.appDetailsPage.tabs.overview');
            const performanceTab = screen.getByText('vitality.appDetailsPage.tabs.performance');

            expect(performanceTab).toHaveClass('bg-white', 'text-slate-900', 'shadow-sm');
            expect(overviewTab).toHaveClass('text-slate-700');
        });
    });

    it('calls export function when export button is clicked', async () => {
        const { exportAppDetailsDataToCSV } = await import(
            '../../commons/utils/VitalityDataExportUtils'
        );

        renderComponent();

        await waitFor(() => {
            const exportButton = screen.getByText('vitality.appDetailsPage.exportButton');
            fireEvent.click(exportButton);
        });

        expect(exportAppDetailsDataToCSV).toHaveBeenCalledWith(
            mockAppData.getApplicationDetailsInfoByParams,
        );
    });

    it('shows loading state when data is loading', async () => {
        vi.mocked(useClientQuery).mockReturnValue({
            isLoading: true,
            data: null,
        } as unknown as ReturnType<typeof useClientQuery>);

        renderComponent();

        expect(document.querySelectorAll('.animate-pulse')).toHaveLength(3);
        expect(document.querySelector('.bg-gray-100')).toBeInTheDocument();
    });

    it('passes app data to child components', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('summary-card')).toHaveTextContent('Summary Card - Test App');
            expect(screen.getByTestId('general-information-view')).toHaveTextContent(
                'General Information View - Test App',
            );
        });
    });

    it('renders with correct grid layout', async () => {
        renderComponent();

        const mainContainer = document.querySelector('.grid.grid-cols-12');
        expect(mainContainer).toBeInTheDocument();

        const summaryColumn = document.querySelector('.col-span-3');
        const contentColumn = document.querySelector('.col-span-9');

        expect(summaryColumn).toBeInTheDocument();
        expect(contentColumn).toBeInTheDocument();
    });

    it('handles branch selection correctly', async () => {
        renderComponent();

        await waitFor(() => {
            const branchSelector = screen.getByRole('combobox');
            expect(branchSelector).toBeInTheDocument();
        });
    });
});
