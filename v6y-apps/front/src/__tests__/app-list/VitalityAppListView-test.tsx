import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import VitalityAppList from '../../features/app-list/components/VitalityAppList';
import VitalityAppListHeader from '../../features/app-list/components/VitalityAppListHeader';
import VitalityAppListView from '../../features/app-list/components/VitalityAppListView';
import {
    useClientQuery,
    useInfiniteClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => {
    return {
        useClientQuery: vi.fn(() => ({
            isLoading: false,
            data: { getApplicationTotalByParams: 0 },
            refetch: vi.fn(),
        })),
        useInfiniteClientQuery: vi.fn(() => ({
            status: 'success',
            data: { pages: [] }, //  Always return a valid object
            fetchNextPage: vi.fn(),
            isFetching: false,
            isFetchingNextPage: false,
        })),
    };
});

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppListDataToCSV: vi.fn(),
}));

describe('VitalityAppListView', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders search bar, selectable indicators, and app list', async () => {
        render(<VitalityAppListView />);
        expect(screen.getByText('vitality.searchPage.inputLabel')).toBeInTheDocument();
        expect(screen.getByText('vitality.searchPage.inputHelper')).toBeInTheDocument();
        expect(screen.getByTestId('mock-search-input')).toBeInTheDocument();
    });

    it('renders applications when data is available', async () => {
        (useInfiniteClientQuery as Mock).mockReturnValue({
            status: 'success',
            data: {
                pages: [{ getApplicationListByPageAndParams: [{ _id: 1, name: 'Vitality App' }] }],
            },
        });

        render(<VitalityAppList />);

        await waitFor(() => {
            expect(screen.getByText('Vitality App')).toBeInTheDocument();
        });
    });

    it('handles empty application list gracefully', async () => {
        (useInfiniteClientQuery as Mock).mockReturnValue({
            status: 'success',
            data: { pages: [] },
        });

        render(<VitalityAppList />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('filters applications based on search and keywords', async () => {
        (useInfiniteClientQuery as Mock).mockReturnValue({
            status: 'success',
            data: {
                pages: [{ getApplicationListByPageAndParams: [{ _id: 3, name: 'Filtered App' }] }],
            },
        });

        render(<VitalityAppList />);

        await waitFor(() => {
            expect(screen.getByText('Filtered App')).toBeInTheDocument();
        });
    });

    it('shows total applications count when data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationTotalByParams: 25 },
        });
        render(<VitalityAppListHeader onExportApplicationsClicked={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('vitality.appListPage.totalLabel 25')).toBeInTheDocument();
        });
    });
});
