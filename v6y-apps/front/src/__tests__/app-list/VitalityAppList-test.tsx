import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';

import VitalityAppList from '../../features/app-list/components/VitalityAppList';
import VitalityAppListHeader from '../../features/app-list/components/VitalityAppListHeader';
import {
    useClientQuery,
    useInfiniteClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter';

describe('VitalityAppList', () => {
    it('renders applications when data is available', async () => {
        (useInfiniteClientQuery as Mock).mockReturnValue({
            status: 'success',
            data: {
                pages: [
                    {
                        totalCount: 1,
                        getApplicationListByPageAndParams: [{ _id: 1, name: 'Vitality App' }],
                    },
                ],
            },
            fetchNextPage: vi.fn(),
            isFetching: false,
            isFetchingNextPage: false,
        });

        render(<VitalityAppList />);

        await waitFor(() => {
            const appNames = screen.getAllByTestId('app-name');
            expect(appNames.length).toBeGreaterThan(0);
            expect(appNames[0]).toHaveTextContent('Vitality App');
        });
    });

    it('handles empty application list gracefully', async () => {
        (useInfiniteClientQuery as Mock).mockReturnValue({
            status: 'success',
            data: {
                pages: [
                    {
                        totalCount: 0,
                        getApplicationListByPageAndParams: [],
                    },
                ],
            },
            fetchNextPage: vi.fn(),
            isFetching: false,
            isFetchingNextPage: false,
        });

        render(<VitalityAppList />);

        await waitFor(() => {
            expect(screen.getByText('vitality.appListPage.empty')).toBeInTheDocument();
        });
    });

    it('filters applications based on search and keywords', async () => {
        (useInfiniteClientQuery as Mock).mockReturnValue({
            status: 'success',
            data: {
                totalCount: 1,
                pages: [
                    {
                        totalCount: 1,
                        getApplicationListByPageAndParams: [{ _id: 3, name: 'Filtered App' }],
                    },
                ],
            },
            fetchNextPage: vi.fn(),
            isFetching: false,
            isFetchingNextPage: false,
        });

        render(<VitalityAppList />);

        await waitFor(() => {
            const appNames = screen.getAllByTestId('app-name');
            expect(appNames.length).toBeGreaterThan(0);
            expect(appNames[0]).toHaveTextContent('Filtered App');
        });
    });

    it('shows total applications count when data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationTotalByParams: 25 },
        });
        render(<VitalityAppListHeader onExportApplicationsClicked={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('25 results')).toBeInTheDocument();
        });
    });
});
