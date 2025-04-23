import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import VitalityQualityIndicatorsView from '../../features/app-details/components/quality-indicators/VitalityQualityIndicatorsView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
}));

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppQualityIndicatorsToCSV: vi.fn(),
}));

describe('VitalityQualityIndicatorsView', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state while fetching data', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(<VitalityQualityIndicatorsView />);

        expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    });

    it('renders quality indicators correctly when data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsKeywordsByParams: [
                    {
                        _id: 1,
                        label: 'Security',
                        status: 'up-to-date',
                        module: { branch: 'main' },
                    },
                    {
                        _id: 2,
                        label: 'Performance',
                        status: 'outdated',
                        module: { branch: 'develop' },
                    },
                ],
            },
        });

        render(<VitalityQualityIndicatorsView />);

        await waitFor(() => {
            expect(
                screen.getByText('vitality.appDetailsPage.qualityStatus.title'),
            ).toBeInTheDocument();
            expect(screen.getByText('Performance')).toBeInTheDocument();

            expect(screen.getAllByRole('option')).toHaveLength(4);
            expect(screen.getAllByRole('option')[0]).toHaveTextContent(
                'vitality.appDetailsPage.qualityStatus.selectPlaceholder',
            );
            expect(screen.getAllByRole('option')[1]).toHaveTextContent('All');
            expect(screen.getAllByRole('option')[2]).toHaveTextContent('main');
            expect(screen.getAllByRole('option')[3]).toHaveTextContent('develop');
        });
    });

    it('handles missing quality indicators gracefully', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsKeywordsByParams: [] },
        });

        render(<VitalityQualityIndicatorsView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: null, // Simulating an error
        });

        render(<VitalityQualityIndicatorsView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('filters and maps indicators correctly', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsKeywordsByParams: [
                    {
                        _id: 3,
                        label: 'Maintainability',
                        status: 'success',
                        module: { branch: 'stable' },
                    },
                    {
                        _id: 4,
                        label: 'Code Quality',
                        status: 'deprecated',
                        module: { branch: '' }, // Should be filtered out
                    },
                ],
            },
        });

        render(<VitalityQualityIndicatorsView />);

        await waitFor(() => {
            expect(screen.queryByText('Code Quality')).not.toBeInTheDocument(); // Should be filtered out
            expect(screen.getByText('Maintainability')).toBeInTheDocument();
        });
    });

    it('renders indicators correctly with missing optional fields', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsKeywordsByParams: [
                    {
                        _id: 5,
                        label: 'Scalability',
                        status: 'warning',
                        // No module branch
                    },
                ],
            },
        });

        render(<VitalityQualityIndicatorsView />);

        await waitFor(() => {
            expect(screen.getByText('No Data Available')).toBeInTheDocument();
        });
    });

    it('renders indicators with different statuses correctly', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsKeywordsByParams: [
                    { _id: 8, label: 'Scalability', status: 'warning', module: { branch: 'main' } },
                    { _id: 9, label: 'Security', status: 'success', module: { branch: 'main' } },
                    {
                        _id: 10,
                        label: 'Maintainability',
                        status: 'deprecated',
                        module: { branch: 'legacy' },
                    },
                ],
            },
        });

        render(<VitalityQualityIndicatorsView />);

        await waitFor(() => {
            expect(screen.getAllByRole('button')).toHaveLength(3);
            expect(screen.getAllByRole('button')[0]).toHaveTextContent('deprecated');
            expect(screen.getAllByRole('button')[1]).toHaveTextContent('warning');
            expect(screen.getAllByRole('button')[2]).toHaveTextContent('success');

            expect(
                screen.getByText('vitality.appDetailsPage.qualityStatus.title'),
            ).toBeInTheDocument();
            expect(screen.getByText('Maintainability')).toBeInTheDocument();
        });
    });

    it('renders repository and links correctly when present', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsKeywordsByParams: [
                    {
                        _id: 11,
                        label: 'Reliability',
                        status: 'error',
                        module: { branch: 'fix-branch' },
                    },
                    {
                        _id: 12,
                        label: 'UX Testing',
                        status: 'success',
                        module: { branch: 'ui-improvements' },
                    },
                ],
            },
        });

        render(<VitalityQualityIndicatorsView />);

        await waitFor(() => {
            expect(screen.getByText('Reliability')).toBeInTheDocument();
        });
    });
});
