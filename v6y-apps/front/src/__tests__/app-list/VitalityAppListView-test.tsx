import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAppList from '../../features/app-list/components/VitalityAppList';
import VitalityAppListHeader from '../../features/app-list/components/VitalityAppListHeader';
import VitalityAppListView from '../../features/app-list/components/VitalityAppListView';
import {
    useClientQuery,
    useInfiniteClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter';

const mockRouter = {
    replace: vi.fn(),
};

const mockGetUrlParams = vi.fn(() => [undefined]);
const mockCreateUrlQueryParam = vi.fn(() => 'keywords=react');
const mockRemoveUrlQueryParam = vi.fn(() => '');

vi.mock('@v6y/ui-kit-front', async () => {
    const actual = await vi.importActual('@v6y/ui-kit-front');
    return {
        ...actual,
        useNavigationAdapter: () => ({
            getUrlParams: mockGetUrlParams,
            createUrlQueryParam: mockCreateUrlQueryParam,
            removeUrlQueryParam: mockRemoveUrlQueryParam,
            router: mockRouter,
            pathname: '/apps',
        }),
        useTranslationProvider: () => ({
            translate: (key: string) => key,
        }),
    };
});

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

vi.mock('../../features/app-list/components/VitalityAppList', () => ({
    default: () => <div data-testid="mocked-app-list">Mocked App List</div>,
}));

describe('VitalityAppListView', () => {
    beforeEach(() => {
        mockGetUrlParams.mockReturnValue([undefined]);
        mockRouter.replace.mockClear();
        mockCreateUrlQueryParam.mockClear();
        mockRemoveUrlQueryParam.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders technology filters and app list', async () => {
        render(<VitalityAppListView />);

        // Check for technology filter section
        expect(screen.getByText('vitality.dashboardPage.filters.technologies')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Select technologies to filter applications and discover matching projects',
            ),
        ).toBeInTheDocument();

        // Check for technology checkboxes
        expect(screen.getByLabelText('React')).toBeInTheDocument();
        expect(screen.getByLabelText('TypeScript')).toBeInTheDocument();
        expect(screen.getByLabelText('Node.js')).toBeInTheDocument();
        expect(screen.getByLabelText('Python')).toBeInTheDocument();
    });

    it('shows active filters when keywords are selected', async () => {
        // Mock URL params with selected keywords
        mockGetUrlParams.mockReturnValue(['react,typescript']);

        render(<VitalityAppListView />);

        await waitFor(() => {
            expect(screen.getByText('vitality.appListPage.activeFiltersLabel')).toBeInTheDocument();
            expect(screen.getByText('2 selected')).toBeInTheDocument();
            expect(screen.getByText('react ×')).toBeInTheDocument();
            expect(screen.getByText('typescript ×')).toBeInTheDocument();
        });
    });

    it('handles keyword toggle correctly', async () => {
        render(<VitalityAppListView />);

        const reactCheckbox = screen.getByLabelText('React');
        fireEvent.click(reactCheckbox);

        expect(mockCreateUrlQueryParam).toHaveBeenCalledWith('keywords', 'react');
        expect(mockRouter.replace).toHaveBeenCalledWith('/apps?keywords=react', { scroll: false });
    });

    it('removes keywords from URL when unchecked', async () => {
        // Start with selected keywords
        mockGetUrlParams.mockReturnValue(['react,typescript']);

        render(<VitalityAppListView />);

        // Wait for the badge to appear
        const reactBadge = await screen.findByText('react ×');
        fireEvent.click(reactBadge);

        // Then assert the calls were made
        expect(mockCreateUrlQueryParam).toHaveBeenCalledWith('keywords', 'typescript');
        expect(mockRouter.replace).toHaveBeenCalled();
    });
});
