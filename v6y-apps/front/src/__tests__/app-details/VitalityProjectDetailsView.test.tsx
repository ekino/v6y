import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityProjectDetailsView from '../../features/app-details/components/VitalityProjectDetailsView';
import {
    buildClientQuery,
    useClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter';

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
    default: () => <div data-testid="general-information-view">General Information View</div>,
}));

vi.mock('../../features/app-details/components/audit-runs/VitalityAuditRunHistoryView', () => ({
    default: () => <div data-testid="audit-run-history-view">Audit Run History View</div>,
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

vi.mock('../../commons/config/VitalityApiConfig', () => ({
    default: {
        VITALITY_BFF_URL: 'http://localhost:3000',
    },
}));

describe('VitalityProjectDetailsView', () => {
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
                <VitalityProjectDetailsView />
            </TestWrapper>,
        );
    };

    it('renders the summary card, general information and audit history sections', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('summary-card')).toBeInTheDocument();
        });

        expect(screen.getByTestId('general-information-view')).toBeInTheDocument();
        expect(screen.getByTestId('audit-run-history-view')).toBeInTheDocument();
    });

    it('shows the run audit button on the live project details view', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('vitality.appDetailsPage.runAuditButton')).toBeInTheDocument();
        });
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
                .mockResolvedValueOnce({
                    getApplicationLatestAuditRunByParams: { _id: 1 },
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
                        _id: 2,
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
