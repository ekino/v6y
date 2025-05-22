import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityGeneralInformationView from '../../features/app-details/components/infos/VitalityGeneralInformationView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

// Mocks
vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
}));

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppDetailsDataToCSV: vi.fn(),
}));

vi.mock('@v6y/ui-kit', async () => {
    const originalModule = await vi.importActual('@v6y/ui-kit');
    return {
        ...originalModule,
        useNavigationAdapter: vi.fn(),
        useTranslationProvider: vi.fn(),
        InfoOutlined: () => <div data-testid="mock-info-outlined" />,
        DynamicLoader: (fn: () => any) => {
            // This will mock the DynamicLoader to immediately load the component
            // allowing us to mock VitalityAppInfos and VitalitySectionView
            const Component = fn();
            return (props: any) => <Component {...props} />;
        },
    };
});

// Mock specific components that are dynamically loaded or direct children
// We want to check the props passed to these, not their internal rendering.
vi.mock('../../commons/components/VitalitySectionView', () => ({
    default: vi.fn(({ isLoading, isEmpty, children }) => (
        <div data-testid="mock-vitality-section-view">
            {isLoading && <div data-testid="loading-indicator">Loading...</div>}
            {isEmpty && <div data-testid="empty-indicator">Empty</div>}
            {!isLoading && !isEmpty && children}
        </div>
    )),
}));

vi.mock('../../commons/components/application-info/VitalityAppInfos', () => ({
    default: vi.fn(({ app }) => <div data-testid="mock-vitality-app-infos">{app?.name}</div>),
}));

const mockUseClientQuery = useClientQuery as Mock;
const mockGetUrlParams = vi.fn();
const mockTranslate = vi.fn((key) => key); // Simple translation mock

describe('VitalityGeneralInformationView', () => {
    beforeEach(() => {
        (useNavigationAdapter as Mock).mockReturnValue({
            getUrlParams: mockGetUrlParams,
        });
        (useTranslationProvider as Mock).mockReturnValue({
            translate: mockTranslate,
        });
        mockUseClientQuery.mockImplementation(() => ({
            isLoading: false,
            data: undefined,
            refetch: vi.fn(),
        }));
        console.warn = vi.fn(); // Mock console.warn
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when useClientQuery indicates loading', () => {
        mockGetUrlParams.mockReturnValue(['123']); // Valid ID
        mockUseClientQuery.mockReturnValue({
            isLoading: true,
            data: null,
        });

        render(<VitalityGeneralInformationView />);
        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
        const sectionViewProps = (vi.mocked(require('../../commons/components/VitalitySectionView')).default as Mock).mock.calls[0][0];
        expect(sectionViewProps.isLoading).toBe(true);
        expect(sectionViewProps.isEmpty).toBe(true); // Because appInfos is null/undefined initially
    });

    it('renders application details correctly when _id is valid and data is available', async () => {
        const mockAppInfos = {
            _id: 1,
            name: 'Vitality App',
            acronym: 'VAP',
        };
        mockGetUrlParams.mockReturnValue(['1']);
        mockUseClientQuery.mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsInfoByParams: mockAppInfos },
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByTestId('mock-vitality-app-infos')).toBeInTheDocument();
            expect(screen.getByText('Vitality App')).toBeInTheDocument(); // From mock VitalityAppInfos
        });

        const sectionViewProps = (vi.mocked(require('../../commons/components/VitalitySectionView')).default as Mock).mock.calls[0][0];
        expect(sectionViewProps.isLoading).toBe(false);
        expect(sectionViewProps.isEmpty).toBe(false);

        const appInfosProps = (vi.mocked(require('../../commons/components/application-info/VitalityAppInfos')).default as Mock).mock.calls[0][0];
        expect(appInfosProps.app).toEqual(mockAppInfos);

        expect(mockUseClientQuery).toHaveBeenCalledWith(expect.objectContaining({
            queryCacheKey: ['getApplicationDetailsInfoByParams', '1'],
            variables: { _id: 1 },
            enabled: true,
        }));
    });

    it('handles valid _id but API returns no appInfos (null)', async () => {
        mockGetUrlParams.mockReturnValue(['2']);
        mockUseClientQuery.mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsInfoByParams: null },
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-indicator')).toBeInTheDocument();
        });
        const sectionViewProps = (vi.mocked(require('../../commons/components/VitalitySectionView')).default as Mock).mock.calls[0][0];
        expect(sectionViewProps.isLoading).toBe(false);
        expect(sectionViewProps.isEmpty).toBe(true);
        expect(screen.queryByTestId('mock-vitality-app-infos')).not.toBeInTheDocument();
        expect(mockUseClientQuery).toHaveBeenCalledWith(expect.objectContaining({
            queryCacheKey: ['getApplicationDetailsInfoByParams', '2'],
            variables: { _id: 2 },
            enabled: true,
        }));
    });

    it('handles valid _id but API returns no appInfos (undefined data)', async () => {
        mockGetUrlParams.mockReturnValue(['3']);
        mockUseClientQuery.mockReturnValue({
            isLoading: false,
            data: undefined, // Simulate data being undefined
        });

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-indicator')).toBeInTheDocument();
        });
        const sectionViewProps = (vi.mocked(require('../../commons/components/VitalitySectionView')).default as Mock).mock.calls[0][0];
        expect(sectionViewProps.isLoading).toBe(false);
        expect(sectionViewProps.isEmpty).toBe(true);
        expect(mockUseClientQuery).toHaveBeenCalledWith(expect.objectContaining({
            queryCacheKey: ['getApplicationDetailsInfoByParams', '3'],
            variables: { _id: 3 },
            enabled: true,
        }));
    });


    it('handles invalid _id string (e.g., "abc"), disables query, and shows empty state', async () => {
        mockGetUrlParams.mockReturnValue(['abc']); // Invalid _id
        // useClientQuery will use its default mock return (isLoading: false, data: undefined)
        // because enabled should be false

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
             // VitalitySectionView should be in empty state because appInfos is undefined
            expect(screen.getByTestId('empty-indicator')).toBeInTheDocument();
        });

        expect(mockUseClientQuery).toHaveBeenCalledWith(expect.objectContaining({
            queryCacheKey: ['getApplicationDetailsInfoByParams', undefined], // numericId will be undefined
            variables: { _id: undefined },
            enabled: false, // Query should be disabled
        }));
        const sectionViewProps = (vi.mocked(require('../../commons/components/VitalitySectionView')).default as Mock).mock.calls[0][0];
        expect(sectionViewProps.isLoading).toBe(false); // isLoading is false from default mock
        expect(sectionViewProps.isEmpty).toBe(true); // isEmpty because appInfos is undefined
        expect(console.warn).toHaveBeenCalledWith('Invalid or missing _id parameter:', 'abc');
        expect(screen.queryByTestId('mock-vitality-app-infos')).not.toBeInTheDocument();
    });

    it('handles undefined _id, disables query, and shows empty state', async () => {
        mockGetUrlParams.mockReturnValue([undefined]); // _id is undefined
        // useClientQuery will use its default mock return (isLoading: false, data: undefined)

        render(<VitalityGeneralInformationView />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-indicator')).toBeInTheDocument();
        });

        expect(mockUseClientQuery).toHaveBeenCalledWith(expect.objectContaining({
            queryCacheKey: ['getApplicationDetailsInfoByParams', undefined],
            variables: { _id: undefined },
            enabled: false,
        }));
        const sectionViewProps = (vi.mocked(require('../../commons/components/VitalitySectionView')).default as Mock).mock.calls[0][0];
        expect(sectionViewProps.isLoading).toBe(false);
        expect(sectionViewProps.isEmpty).toBe(true);
        expect(console.warn).toHaveBeenCalledWith('Invalid or missing _id parameter:', undefined);
        expect(screen.queryByTestId('mock-vitality-app-infos')).not.toBeInTheDocument();
    });

    it('correctly forms queryCacheKey with valid numeric string _id', () => {
        mockGetUrlParams.mockReturnValue(['456']);
        mockUseClientQuery.mockReturnValue({ isLoading: false, data: null });

        render(<VitalityGeneralInformationView />);

        expect(mockUseClientQuery).toHaveBeenCalledWith(expect.objectContaining({
            queryCacheKey: ['getApplicationDetailsInfoByParams', '456'],
            variables: { _id: 456 },
            enabled: true,
        }));
    });
});
