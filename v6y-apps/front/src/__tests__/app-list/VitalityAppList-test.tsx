import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';

import VitalityAppList from '../../features/app-list/components/VitalityAppList';
import VitalityAppListHeader from '../../features/app-list/components/VitalityAppListHeader';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

describe('VitalityAppList', () => {
    it('renders applications when data is available', async () => {
        (useClientQuery as Mock)
            .mockReturnValueOnce({
                isLoading: false,
                isFetching: false,
                data: {
                    getApplicationListByPageAndParams: [{ _id: 1, name: 'Vitality App' }],
                },
            })
            .mockReturnValueOnce({
                isLoading: false,
                isFetching: false,
                data: {
                    getAllAuditRuns: [],
                },
            });

        render(<VitalityAppList />);

        await waitFor(() => {
            const appNames = screen.getAllByTestId('app-name');
            expect(appNames.length).toBeGreaterThan(0);
            expect(appNames[0]).toHaveTextContent('Vitality App');
        });
    });

    it('handles empty application list gracefully', async () => {
        (useClientQuery as Mock)
            .mockReturnValueOnce({
                isLoading: false,
                isFetching: false,
                data: {
                    getApplicationListByPageAndParams: [],
                },
            })
            .mockReturnValueOnce({
                isLoading: false,
                isFetching: false,
                data: {
                    getAllAuditRuns: [],
                },
            });

        render(<VitalityAppList />);

        await waitFor(() => {
            expect(screen.getByText('vitality.appListPage.empty')).toBeInTheDocument();
        });
    });

    it('applies report count filters correctly', async () => {
        (useClientQuery as Mock)
            .mockReturnValueOnce({
                isLoading: false,
                isFetching: false,
                data: {
                    getApplicationListByPageAndParams: [
                        { _id: 1, name: 'Filtered In App' },
                        { _id: 2, name: 'Filtered Out App' },
                    ],
                },
            })
            .mockReturnValueOnce({
                isLoading: false,
                isFetching: false,
                data: {
                    getAllAuditRuns: [
                        { _id: 10, appId: 1, triggeredAt: '2026-01-01T00:00:00.000Z' },
                        { _id: 11, appId: 1, triggeredAt: '2026-01-02T00:00:00.000Z' },
                    ],
                },
            });

        render(<VitalityAppList filters={{ minReports: 2 }} />);

        await waitFor(() => {
            const appNames = screen.getAllByTestId('app-name');
            expect(appNames.length).toBe(1);
            expect(appNames[0]).toHaveTextContent('Filtered In App');
            expect(screen.queryByText('Filtered Out App')).not.toBeInTheDocument();
        });
    });

    it('shows total applications count when data is available', async () => {
        render(<VitalityAppListHeader appsTotal={25} />);

        await waitFor(() => {
            expect(screen.getByText('25 results')).toBeInTheDocument();
        });
    });

    it('filters applications based on search and keywords', async () => {
        (useClientQuery as Mock)
            .mockReturnValueOnce({
                isLoading: false,
                isFetching: false,
                data: {
                    getApplicationListByPageAndParams: [{ _id: 3, name: 'Filtered App' }],
                },
            })
            .mockReturnValueOnce({
                isLoading: false,
                isFetching: false,
                data: {
                    getAllAuditRuns: [],
                },
            });

        render(<VitalityAppList />);

        await waitFor(() => {
            const appNames = screen.getAllByTestId('app-name');
            expect(appNames.length).toBeGreaterThan(0);
            expect(appNames[0]).toHaveTextContent('Filtered App');
        });
    });
});
