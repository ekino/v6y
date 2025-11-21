import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ApplicationType } from '@v6y/core-logic/src/types';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VitalityGeneralInformationView from '../../features/app-details/components/infos/VitalityGeneralInformationView';

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppDetailsDataToCSV: vi.fn(),
}));

describe('VitalityGeneralInformationView', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state while fetching data', async () => {
        render(<VitalityGeneralInformationView isLoading />);

        expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    });

    it('renders application details correctly when data is available', async () => {
        render(
            <VitalityGeneralInformationView
                appInfos={
                    {
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
                    } as unknown as ApplicationType
                }
            />,
        );

        await waitFor(() => {
            expect(screen.getByTestId('app-name')).toHaveTextContent(
                'vitality.appDetailsPage.infos.description'.replace('{appName}', 'Vitality App'),
            );
            expect(screen.getByTestId('branches-count')).toHaveTextContent(
                'vitality.appDetailsPage.infos.branches',
            );
        });
    });

    it('handles missing application data gracefully', async () => {
        render(<VitalityGeneralInformationView appInfos={undefined} />);

        await waitFor(() => {
            expect(screen.getByTestId('app-name')).toHaveTextContent(
                'vitality.appDetailsPage.infos.description'.replace('{appName}', 'Vitality'),
            );
        });
    });

    it('handles API errors gracefully', async () => {
        render(<VitalityGeneralInformationView appInfos={undefined} />);

        await waitFor(() => {
            expect(screen.getByTestId('app-name')).toHaveTextContent(
                'vitality.appDetailsPage.infos.description'.replace('{appName}', 'Vitality'),
            );
        });
    });

    it('renders application with missing required fields using defaults', async () => {
        render(
            <VitalityGeneralInformationView
                appInfos={
                    {
                        _id: 3,
                        acronym: '',
                        description: 'This should not be displayed',
                    } as unknown as ApplicationType
                }
            />,
        );

        await waitFor(() => {
            expect(screen.getByTestId('app-name')).toHaveTextContent(
                'vitality.appDetailsPage.infos.description'.replace('{appName}', 'Vitality'),
            );
        });

        expect(screen.queryByText('This should not be displayed')).not.toBeInTheDocument();
    });

    it('renders repository and links correctly when present', async () => {
        render(
            <VitalityGeneralInformationView
                appInfos={
                    {
                        _id: 4,
                        name: 'Vitality Repo Test',
                        acronym: 'VRT',
                        repo: {
                            organization: 'Vitality Org',
                            webUrl: 'https://github.com/vitality-org',
                            allBranches: ['main', 'feature-x'],
                        },
                        links: [{ label: 'Docs', value: 'https://docs.vitality.com' }],
                    } as unknown as ApplicationType
                }
            />,
        );

        await waitFor(() => {
            expect(screen.getByTestId('app-name')).toHaveTextContent(
                'vitality.appDetailsPage.infos.description'.replace(
                    '{appName}',
                    'Vitality Repo Test',
                ),
            );
        });
    });

    it('does not render empty repository fields', async () => {
        render(
            <VitalityGeneralInformationView
                appInfos={
                    {
                        _id: 5,
                        name: 'Vitality No Repo',
                        acronym: 'VNR',
                        repo: { organization: '', webUrl: '', allBranches: [] },
                        links: [],
                    } as unknown as ApplicationType
                }
            />,
        );

        await waitFor(() => {
            expect(screen.getByTestId('app-name')).toHaveTextContent(
                'vitality.appDetailsPage.infos.description',
            );
        });

        expect(screen.queryByText('Vitality Org')).not.toBeInTheDocument();
        expect(screen.queryByText('Docs')).not.toBeInTheDocument();
    });
});
