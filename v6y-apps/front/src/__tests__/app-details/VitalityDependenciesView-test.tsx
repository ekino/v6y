import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import VitalityDependenciesView from '../../features/app-details/components/dependencies/VitalityDependenciesView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
}));

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppDependenciesToCSV: vi.fn(),
}));

describe('VitalityDependenciesView', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state while fetching data', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(<VitalityDependenciesView />);

        expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    });

    it('renders dependencies correctly when data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsDependenciesByParams: [
                    {
                        _id: 1,
                        type: 'library',
                        name: 'React',
                        version: '17.0.2',
                        recommendedVersion: '18.0.0',
                        status: 'Outdated',
                        statusHelp: {
                            category: 'Security',
                            title: 'Version outdated',
                        },
                        module: {
                            branch: 'main',
                        },
                    },
                ],
            },
        });

        render(<VitalityDependenciesView />);

        await waitFor(() => {
            expect(screen.getByText('React')).toBeInTheDocument();
            expect(screen.getByText('Outdated')).toBeInTheDocument();
        });
    });

    it('handles missing dependencies gracefully', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsDependenciesByParams: [] },
        });

        render(<VitalityDependenciesView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: null, // Simulating an error where data is null
        });

        render(<VitalityDependenciesView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('filters and maps dependencies correctly', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsDependenciesByParams: [
                    {
                        _id: 3,
                        type: 'library',
                        name: 'Axios',
                        version: '1.2.3',
                        recommendedVersion: '1.2.5',
                        status: 'Warning',
                        statusHelp: {
                            category: 'Security',
                            title: 'Minor security vulnerability detected',
                        },
                        module: {
                            branch: '',
                        },
                    },
                    {
                        _id: 4,
                        type: 'library',
                        name: 'Jest',
                        version: '27.0.0',
                        recommendedVersion: '27.4.3',
                        status: 'Updated',
                        statusHelp: {
                            category: 'Stability',
                            title: 'Stable version in use',
                        },
                        module: {
                            branch: 'test',
                        },
                    },
                ],
            },
        });

        render(<VitalityDependenciesView />);

        await waitFor(() => {
            expect(screen.queryByText('Axios')).not.toBeInTheDocument(); // empty branch
            expect(screen.queryByText('Warning')).not.toBeInTheDocument(); // empty branch
            expect(screen.getByText('Jest')).toBeInTheDocument();
            expect(screen.getByText('Updated')).toBeInTheDocument();
        });
    });

    it('renders dependencies correctly with missing optional fields', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsDependenciesByParams: [
                    {
                        _id: 2,
                        type: 'library',
                        name: 'Lodash',
                        status: 'Updated',
                        // Missing `version`, `recommendedVersion`, and `statusHelp`
                        module: { branch: 'develop' },
                    },
                ],
            },
        });

        render(<VitalityDependenciesView />);

        await waitFor(() => {
            expect(screen.queryByText('Lodash')).not.toBeInTheDocument();
            expect(screen.queryByText('Updated')).not.toBeInTheDocument();
        });
    });

    it('does not render dependencies with missing required fields', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsDependenciesByParams: [
                    {
                        _id: 3,
                        type: 'library',
                        name: '', // Invalid: Missing name
                        version: '1.0.0',
                        status: 'Updated',
                        module: { branch: '' }, // Invalid: Missing branch
                    },
                    {
                        _id: 4,
                        type: 'library',
                        name: 'ValidDependency',
                        version: '2.0.0',
                        status: 'Up-to-date',
                        module: { branch: 'release' },
                    },
                ],
            },
        });

        render(<VitalityDependenciesView />);

        await waitFor(() => {
            expect(screen.getByText('No Data Available')).toBeInTheDocument();
        });
    });
});
