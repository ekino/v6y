import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import VitalityAppList from '../../features/app-list/components/VitalityAppList';
import VitalityAppListHeader from '../../features/app-list/components/VitalityAppListHeader';
import {
    useClientQuery,
    useInfiniteClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter';

// Mock child components
vi.mock('../../features/app-list/components/VitalityAppListInfo', () => ({
    __esModule: true,
    default: () => <div data-testid="app-list-info">App List Info</div>,
}));

vi.mock('../../features/app-list/components/VitalityAppListHeader', () => ({
    __esModule: true,
    default: ({ onExportApplicationsClicked }: { onExportApplicationsClicked: () => void }) => (
        <div data-testid="app-list-header" onClick={onExportApplicationsClicked}>
            App List Header
        </div>
    ),
}));

vi.mock('../../features/app-list/components/VitalityAppListPagination', () => ({
    __esModule: true,
    default: () => <div data-testid="app-list-pagination">Pagination</div>,
}));

vi.mock('../../commons/components/application-info/VitalityAppInfos', () => ({
    __esModule: true,
    default: ({ app }: { app: { _id: number; name: string } }) => (
        <div data-testid={`app-info-${app._id}`}>{app.name}</div>
    ),
}));

describe('VitalityAppList', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    const mockAppListData = (apps: Array<{ _id: number; name: string }>) => {
        (useInfiniteClientQuery as Mock).mockReturnValue({
            status: 'success',
            data: {
                pages: [
                    {
                        totalCount: apps.length,
                        getApplicationListByPageAndParams: apps,
                    },
                ],
            },
            fetchNextPage: vi.fn(),
            isFetching: false,
            isFetchingNextPage: false,
        });
    };

    it('renders info section, header, and applications in grid with pagination', async () => {
        mockAppListData([{ _id: 1, name: 'Test App' }]);

        const { container } = render(<VitalityAppList />);

        await waitFor(() => {
            expect(screen.getByTestId('app-list-info')).toBeInTheDocument();
            expect(screen.getByTestId('app-list-header')).toBeInTheDocument();
            expect(screen.getByTestId('app-info-1')).toBeInTheDocument();
            expect(screen.getByTestId('app-list-pagination')).toBeInTheDocument();
            // Verify grid layout
            expect(container.querySelector('.grid')).toBeInTheDocument();
        });
    });

    it('displays "Add Project" button alongside applications', async () => {
        mockAppListData([{ _id: 1, name: 'App One' }]);

        render(<VitalityAppList />);

        await waitFor(() => {
            expect(screen.getByText('vitality.appListPage.goToBackOffice')).toBeInTheDocument();
        });
    });

    it('shows empty state when no applications exist', async () => {
        mockAppListData([]);

        render(<VitalityAppList />);

        await waitFor(() => {
            expect(screen.getByText('vitality.appListPage.empty')).toBeInTheDocument();
            expect(screen.queryByTestId('app-list-pagination')).not.toBeInTheDocument();
        });
    });

    it('shows application count in header', async () => {
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
