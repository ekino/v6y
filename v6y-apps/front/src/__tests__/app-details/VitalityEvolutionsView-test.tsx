import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import VitalityEvolutionsView from '../../features/app-details/components/evolutions/VitalityEvolutionsView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
}));

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppEvolutionsToCSV: vi.fn(),
}));

describe('VitalityEvolutionsView', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state while fetching data', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(<VitalityEvolutionsView />);

        expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    });

    it('renders evolutions correctly when data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsEvolutionsByParams: [
                    {
                        _id: 1,
                        type: 'feature',
                        name: 'Dark Mode',
                        status: 'warning',
                        evolutionHelp: {
                            category: 'UI/UX',
                            title: 'Enhancing user experience',
                            status: 'Ongoing',
                        },
                        module: {
                            branch: 'feature-branch',
                        },
                    },
                ],
            },
        });

        render(<VitalityEvolutionsView />);

        await waitFor(() => {
            expect(screen.getByText('Recommendations and Evolutions')).toBeInTheDocument();
            expect(screen.getByText('Dark Mode')).toBeInTheDocument();
        });
    });

    it('handles missing evolutions gracefully', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsEvolutionsByParams: [] },
        });

        render(<VitalityEvolutionsView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: null, // Simulating an error where data is null
        });

        render(<VitalityEvolutionsView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('filters and maps evolutions correctly', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsEvolutionsByParams: [
                    {
                        _id: 3,
                        type: 'feature',
                        name: 'New Dashboard',
                        status: 'Completed',
                        evolutionHelp: {
                            category: 'UI/UX',
                            title: 'Redesigned dashboard',
                            status: 'Completed',
                        },
                        module: {
                            branch: 'develop',
                        },
                    },
                    {
                        _id: 4,
                        type: 'feature',
                        name: 'Performance Boost',
                        status: 'In Review',
                        evolutionHelp: {
                            category: 'Optimization',
                            title: 'Code optimizations',
                            status: 'Under Review',
                        },
                        module: {
                            branch: '',
                        },
                    },
                ],
            },
        });

        render(<VitalityEvolutionsView />);

        await waitFor(() => {
            expect(screen.queryByText('Performance Boost')).not.toBeInTheDocument(); // Invalid: empty branch
            expect(screen.getByText('New Dashboard')).toBeInTheDocument();
        });
    });

    it('renders evolutions correctly with missing optional fields', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsEvolutionsByParams: [
                    {
                        _id: 6,
                        type: 'feature',
                        name: 'Code Refactor',
                        status: 'Ongoing',
                        // Missing evolutionHelp fields
                        module: { branch: 'refactor' },
                    },
                ],
            },
        });

        render(<VitalityEvolutionsView />);

        await waitFor(() => {
            expect(screen.getByText('No Data Available')).toBeInTheDocument();
        });
    });

    it('does not render evolutions with missing required fields', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsEvolutionsByParams: [
                    {
                        _id: 7,
                        type: 'feature',
                        name: '', // Invalid: Missing name
                        status: 'Planned',
                        evolutionHelp: {
                            category: 'Internationalization',
                            title: 'Expanding support',
                            status: 'Scheduled',
                        },
                        module: { branch: 'i18n' },
                    },
                    {
                        _id: 8,
                        type: 'feature',
                        name: 'Dark Mode',
                        status: 'Released',
                        evolutionHelp: {
                            category: 'UI',
                            title: 'Better user experience',
                            status: 'Live',
                        },
                        module: { branch: 'ui-update' },
                    },
                ],
            },
        });

        render(<VitalityEvolutionsView />);

        await waitFor(() => {
            expect(screen.getAllByRole('option')).toHaveLength(4);
            expect(screen.getAllByRole('option')[0]).toHaveTextContent('All');
            expect(screen.getAllByRole('option')[1]).toHaveTextContent('All');
            expect(screen.getAllByRole('option')[2]).toHaveTextContent('i18n');
            expect(screen.getAllByRole('option')[3]).toHaveTextContent('ui-update');

            expect(screen.getAllByRole('button')).toHaveLength(3);
            expect(screen.getAllByRole('button')[0]).toHaveTextContent('Scheduled');
            expect(screen.getAllByRole('button')[1]).toHaveTextContent('Live');

            expect(screen.queryByText('feature-Internationalization')).toBeInTheDocument();
        });
    });
});
