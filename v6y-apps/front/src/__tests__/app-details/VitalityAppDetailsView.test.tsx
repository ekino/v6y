import '@testing-library/jest-dom/vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAppDetailsView from '../../features/app-details/components/VitalityAppDetailsView';
import {
    buildClientQuery,
    useClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

vi.mock('@v6y/ui-kit-front', async () => {
    const actual = await vi.importActual<typeof import('@v6y/ui-kit-front')>('@v6y/ui-kit-front');

    return {
        ...actual,
        toast: {
            ...actual.toast,
            loading: vi.fn(),
            success: vi.fn(),
            error: vi.fn(),
            message: vi.fn(),
        },
    };
});

vi.mock('../../features/app-details/components/audit-reports/VitalityAuditReportsView', () => ({
    default: () => <div data-testid="audit-reports-view">Audit Reports View</div>,
}));

vi.mock('../../features/app-details/components/audit-reports/VitalitySecuritySection', () => ({
    default: () => (
        <div>
            <div data-testid="audit-reports-view">Security Audit Reports</div>
            <div data-testid="dependencies-view">Security Dependencies</div>
        </div>
    ),
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

vi.mock('../../features/app-details/components/sonarqube/VitalitySonarQubeView', () => ({
    default: ({ sonarqubeUrl }: { sonarqubeUrl: string }) => (
        <div data-testid="sonarqube-view">SonarQube View - {sonarqubeUrl}</div>
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

    const renderComponent = (props?: React.ComponentProps<typeof VitalityAppDetailsView>) => {
        return renderWithProviders(<VitalityAppDetailsView {...props} />);
    };

    it('renders the component with all main sections', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('summary-card')).toBeInTheDocument();
        });

        expect(screen.getByRole('combobox')).toBeInTheDocument();

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(4);

        expect(screen.getByText('vitality.appDetailsPage.tabs.performance')).toBeInTheDocument();
        expect(screen.getByText('vitality.appDetailsPage.tabs.accessibility')).toBeInTheDocument();
        expect(screen.getByText('vitality.appDetailsPage.tabs.security')).toBeInTheDocument();
        expect(
            screen.getByText('vitality.appDetailsPage.tabs.maintainability'),
        ).toBeInTheDocument();

        expect(screen.getByText('vitality.appDetailsPage.exportButton')).toBeInTheDocument();
        expect(
            screen.queryByText('vitality.appDetailsPage.tabs.sonarqube'),
        ).not.toBeInTheDocument();
    });

    it('renders SonarQube tab when SonarQube link is configured', async () => {
        vi.mocked(useClientQuery).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsInfoByParams: {
                    ...mockAppData.getApplicationDetailsInfoByParams,
                    links: [
                        {
                            label: 'Application SonarQube url',
                            value: 'https://sonarqube.example.com/dashboard?id=test-app',
                        },
                    ],
                },
            },
        } as unknown as ReturnType<typeof useClientQuery>);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('vitality.appDetailsPage.tabs.sonarqube')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.sonarqube'));

        await waitFor(() => {
            expect(screen.getByTestId('sonarqube-view')).toBeInTheDocument();
        });
    });

    it('shows Performance tab content by default', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('audit-reports-view')).toBeInTheDocument();
        });
    });

    it('switches tab content when clicking different tabs', async () => {
        renderComponent();

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.performance'));
        await waitFor(() => {
            expect(screen.getByTestId('audit-reports-view')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.accessibility'));
        await waitFor(() => {
            expect(screen.getByTestId('audit-reports-view')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.security'));
        await waitFor(() => {
            expect(screen.getByTestId('audit-reports-view')).toBeInTheDocument();
            expect(screen.getByTestId('dependencies-view')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('vitality.appDetailsPage.tabs.maintainability'));
        await waitFor(() => {
            expect(screen.getByTestId('audit-reports-view')).toBeInTheDocument();
        });
    });

    it('marks the clicked tab as selected', async () => {
        renderComponent();

        await waitFor(() => {
            expect(
                screen.getByRole('tab', { name: 'vitality.appDetailsPage.tabs.performance' }),
            ).toHaveAttribute('aria-selected', 'true');
        });

        fireEvent.click(
            screen.getByRole('tab', { name: 'vitality.appDetailsPage.tabs.accessibility' }),
        );

        await waitFor(() => {
            expect(
                screen.getByRole('tab', { name: 'vitality.appDetailsPage.tabs.accessibility' }),
            ).toHaveAttribute('aria-selected', 'true');
            expect(
                screen.getByRole('tab', { name: 'vitality.appDetailsPage.tabs.performance' }),
            ).toHaveAttribute('aria-selected', 'false');
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

        expect(screen.getByTestId('app-details-skeleton')).toBeInTheDocument();
    });

    it('passes app data to child components', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('summary-card')).toHaveTextContent('Summary Card - Test App');
        });
    });

    it('renders the summary card alongside the details tabs', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('summary-card')).toBeInTheDocument();
        });

        expect(screen.getByRole('tablist', { name: 'Details tabs' })).toBeInTheDocument();
    });

    it('handles branch selection correctly', async () => {
        renderComponent();

        await waitFor(() => {
            const branchSelector = screen.getByRole('combobox');
            expect(branchSelector).toBeInTheDocument();
        });
    });

    it('shows the run audit button on the application details view', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('vitality.appDetailsPage.runAuditButton')).toBeInTheDocument();
        });
    });

    it('hides the run audit button when viewing a specific audit run (report details)', async () => {
        renderComponent({ applicationId: 123, auditRunId: 99 });

        await waitFor(() => {
            expect(screen.getByTestId('summary-card')).toBeInTheDocument();
        });

        expect(
            screen.queryByText('vitality.appDetailsPage.runAuditButton'),
        ).not.toBeInTheDocument();
    });

    it('shows the AI summary card on the application details view', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('ai-summary-card')).toBeInTheDocument();
        });
    });

    it('hides the AI summary card when viewing a specific audit run (report details)', async () => {
        renderComponent({ applicationId: 123, auditRunId: 99 });

        await waitFor(() => {
            expect(screen.getByTestId('summary-card')).toBeInTheDocument();
        });

        expect(screen.queryByTestId('ai-summary-card')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ai-summary-card-loading')).not.toBeInTheDocument();
    });

    describe('running an audit', () => {
        beforeEach(() => {
            vi.useFakeTimers({ shouldAdvanceTime: true });
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('queues the analysis then alerts the user once the queued run completes', async () => {
            const { toast } = await import('@v6y/ui-kit-front');

            vi.mocked(toast.loading).mockReturnValue('audit-toast-id');
            vi.mocked(buildClientQuery)
                // Baseline read: the application already has an older *completed* run,
                // which must not be mistaken for the one about to be triggered.
                .mockResolvedValueOnce({
                    getApplicationLatestAuditRunByParams: {
                        _id: 10,
                        runStatus: 'completed',
                        errorMessage: null,
                    },
                })
                .mockResolvedValueOnce({
                    triggerApplicationAnalysis: {
                        success: true,
                        applicationId: 123,
                        message: 'Application analysis queued successfully.',
                    },
                })
                .mockResolvedValueOnce({
                    getApplicationLatestAuditRunByParams: {
                        _id: 11,
                        runStatus: 'completed',
                        errorMessage: null,
                    },
                });

            renderComponent();

            await waitFor(() => {
                expect(
                    screen.getByText('vitality.appDetailsPage.runAuditButton'),
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('vitality.appDetailsPage.runAuditButton'));

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith(
                    'vitality.appDetailsPage.auditToasts.queued',
                    expect.objectContaining({ id: 'audit-toast-id' }),
                );
            });

            expect(
                screen.getByText('vitality.appDetailsPage.runAuditButtonLoading'),
            ).toBeInTheDocument();

            await vi.advanceTimersByTimeAsync(4000);

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith(
                    'vitality.appDetailsPage.auditToasts.completed',
                    expect.objectContaining({ id: 'audit-toast-id' }),
                );
            });

            await waitFor(() => {
                expect(
                    screen.getByText('vitality.appDetailsPage.runAuditButton'),
                ).toBeInTheDocument();
            });
        });

        it('alerts the user when the queued run ends up failing', async () => {
            const { toast } = await import('@v6y/ui-kit-front');

            vi.mocked(toast.loading).mockReturnValue('audit-toast-id');
            vi.mocked(buildClientQuery)
                .mockResolvedValueOnce({
                    getApplicationLatestAuditRunByParams: {
                        _id: 10,
                        runStatus: 'completed',
                        errorMessage: null,
                    },
                })
                .mockResolvedValueOnce({
                    triggerApplicationAnalysis: {
                        success: true,
                        applicationId: 123,
                        message: 'Application analysis queued successfully.',
                    },
                })
                .mockResolvedValueOnce({
                    getApplicationLatestAuditRunByParams: {
                        _id: 11,
                        runStatus: 'error',
                        errorMessage: 'Static auditor unavailable',
                    },
                });

            renderComponent();

            await waitFor(() => {
                expect(
                    screen.getByText('vitality.appDetailsPage.runAuditButton'),
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('vitality.appDetailsPage.runAuditButton'));

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith(
                    'vitality.appDetailsPage.auditToasts.queued',
                    expect.objectContaining({ id: 'audit-toast-id' }),
                );
            });

            await vi.advanceTimersByTimeAsync(4000);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith(
                    'Static auditor unavailable',
                    expect.objectContaining({ id: 'audit-toast-id' }),
                );
            });
        });

        it('ignores a stale settled run and keeps polling until a newer run appears', async () => {
            const { toast } = await import('@v6y/ui-kit-front');

            vi.mocked(toast.loading).mockReturnValue('audit-toast-id');
            vi.mocked(buildClientQuery)
                .mockResolvedValueOnce({
                    getApplicationLatestAuditRunByParams: {
                        _id: 10,
                        runStatus: 'completed',
                        errorMessage: null,
                    },
                })
                .mockResolvedValueOnce({
                    triggerApplicationAnalysis: {
                        success: true,
                        applicationId: 123,
                        message: 'Application analysis queued successfully.',
                    },
                })
                // The new run does not exist yet, so the query still returns the stale
                // one. It must not be reported as this audit's outcome.
                .mockResolvedValueOnce({
                    getApplicationLatestAuditRunByParams: {
                        _id: 10,
                        runStatus: 'completed',
                        errorMessage: null,
                    },
                })
                .mockResolvedValueOnce({
                    getApplicationLatestAuditRunByParams: {
                        _id: 11,
                        runStatus: 'completed',
                        errorMessage: null,
                    },
                });

            renderComponent();

            await waitFor(() => {
                expect(
                    screen.getByText('vitality.appDetailsPage.runAuditButton'),
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('vitality.appDetailsPage.runAuditButton'));

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith(
                    'vitality.appDetailsPage.auditToasts.queued',
                    expect.objectContaining({ id: 'audit-toast-id' }),
                );
            });

            // First poll: the stale run is returned, no completion toast may fire.
            await vi.advanceTimersByTimeAsync(4000);

            expect(toast.success).not.toHaveBeenCalledWith(
                'vitality.appDetailsPage.auditToasts.completed',
                expect.anything(),
            );

            // Second poll: the freshly created run finally shows up.
            await vi.advanceTimersByTimeAsync(4000);

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith(
                    'vitality.appDetailsPage.auditToasts.completed',
                    expect.objectContaining({ id: 'audit-toast-id' }),
                );
            });
        });
    });
});
