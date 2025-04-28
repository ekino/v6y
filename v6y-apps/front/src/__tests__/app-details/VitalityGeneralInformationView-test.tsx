import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import VitalityGeneralInformationView from '../../features/app-details/components/infos/VitalityGeneralInformationView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
}));

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppDetailsDataToCSV: vi.fn(),
}));

describe('VitalityGeneralInformationView', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state while fetching data', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(<VitalityGeneralInformationView />);

        expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    });

    it('renders application details correctly when data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsInfoByParams: {
                    _id: 1,
                    name: 'Vitality App',
                    acronym: 'VAP',
                    description: 'A powerful application for testing.',
                    contactMail: 'contact@vitality.com',
                    repo: {
                        organization: 'Vitality Org',
                        webUrl: 'https://github.com/vitality-org',
                        allBranches: ['main', 'develop'],
                    },
                    links: [
                        { label: 'Website', value: 'https://vitality.com' },
                        { label: 'Documentation', value: 'https://docs.vitality.com' },
                    ],
                },
            },
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByText('Vitality App')).toBeInTheDocument();
            expect(screen.getByText('A powerful application for testing.')).toBeInTheDocument();
            expect(screen.getByText('vitality.appListPage.nbBranches2')).toBeInTheDocument();
            expect(screen.getByText('Vitality Org')).toBeInTheDocument();
            expect(screen.getByText('Website')).toBeInTheDocument();
            expect(screen.getByText('Documentation')).toBeInTheDocument();
        });
    });

    it('handles missing application data gracefully', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsInfoByParams: {} }, // Empty data
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: null, // Simulating an error
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('renders application without optional fields gracefully', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsInfoByParams: {
                    _id: 2,
                    name: 'Minimal App',
                    acronym: 'MAP',
                    // No description, contactMail, repo, or links
                },
            },
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByText('Minimal App')).toBeInTheDocument();
        });

        expect(screen.queryByText('A powerful application for testing.')).not.toBeInTheDocument();
        expect(screen.queryByText('Website')).not.toBeInTheDocument();
        expect(screen.queryByText('Vitality Org')).not.toBeInTheDocument();
    });

    it('does not render application with missing required fields', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsInfoByParams: {
                    _id: 3,
                    acronym: '', // Missing name and acronym
                    description: 'This should not be displayed',
                },
            },
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });

        expect(screen.queryByText('This should not be displayed')).not.toBeInTheDocument();
    });

    it('renders repository and links correctly when present', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsInfoByParams: {
                    _id: 4,
                    name: 'Vitality Repo Test',
                    acronym: 'VRT',
                    repo: {
                        organization: 'Vitality Org',
                        webUrl: 'https://github.com/vitality-org',
                        allBranches: ['main', 'feature-x'],
                    },
                    links: [{ label: 'Docs', value: 'https://docs.vitality.com' }],
                },
            },
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByText('Vitality Repo Test')).toBeInTheDocument();
            expect(screen.getByText('Vitality Org')).toBeInTheDocument();
            expect(screen.getByText('Docs')).toBeInTheDocument();
        });
    });

    it('does not render empty repository fields', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsInfoByParams: {
                    _id: 5,
                    name: 'Vitality No Repo',
                    acronym: 'VNR',
                    repo: {
                        organization: '',
                        webUrl: '',
                        allBranches: [],
                    },
                    links: [],
                },
            },
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByText('Vitality No Repo')).toBeInTheDocument();
        });

        expect(screen.queryByText('Vitality Org')).not.toBeInTheDocument();
        expect(screen.queryByText('Docs')).not.toBeInTheDocument();
    });
});
