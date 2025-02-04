// VitalityAppListHeader.test.tsx
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useNavigationAdapter } from '@v6y/shared-ui';
import * as React from 'react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { useClientQuery } from '../../../../infrastructure/adapters/api/useQueryAdapter';
import VitalityAppListHeader from '../VitalityAppListHeader';

// Mock useNavigationAdapter
vi.mock(import('@v6y/shared-ui'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigationAdapter: vi.fn(),
    };
});

// Mock useClientQuery
vi.mock('../../../../infrastructure/adapters/api/useQueryAdapter');

describe('VitalityAppListHeader', () => {
    const mockOnExportApplicationsClicked = vi.fn();

    beforeEach(() => {
        (useNavigationAdapter as Mock).mockReturnValue({
            getUrlParams: vi.fn(() => [[], '']),
        });

        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationTotalByParams: 10 },
            refetch: vi.fn(),
        });
    });

    it('should render the component', () => {
        render(
            <VitalityAppListHeader onExportApplicationsClicked={mockOnExportApplicationsClicked} />,
        );

        expect(screen.getByRole('heading').textContent).toEqual(`TOTAL Applications:  10`);
        expect(screen.getByText(`Export Applications`)).toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: 'export Export Applications',
            }),
        ).toBeInTheDocument();
    });

    it('should call onExportApplicationsClicked when the export button is clicked', () => {
        render(
            <VitalityAppListHeader onExportApplicationsClicked={mockOnExportApplicationsClicked} />,
        );

        const exportButton = screen.getByRole('button', {
            name: 'export Export Applications',
        });
        fireEvent.click(exportButton);

        expect(mockOnExportApplicationsClicked).toHaveBeenCalled();
    });

    it('should fetch app total on mount', () => {
        render(
            <VitalityAppListHeader onExportApplicationsClicked={mockOnExportApplicationsClicked} />,
        );

        expect(useClientQuery).toHaveBeenCalled();
        expect((useClientQuery as Mock).mock.results[0].value.refetch).toHaveBeenCalled();
    });

    it('should update app total when data changes', () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationTotalByParams: 5 },
            refetch: vi.fn(),
        });

        render(
            <VitalityAppListHeader onExportApplicationsClicked={mockOnExportApplicationsClicked} />,
        );

        expect(screen.getByRole('heading').textContent).toEqual(`TOTAL Applications:  5`);
    });

    it('should handle missing data', () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: undefined,
            refetch: vi.fn(),
        });

        render(
            <VitalityAppListHeader onExportApplicationsClicked={mockOnExportApplicationsClicked} />,
        );

        // Expecting no title to be rendered if appsTotal is 0 or undefined
        expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    });

    it('should refetch data when keywords or searchText change', () => {
        const refetchMock = vi.fn();
        (useNavigationAdapter as Mock).mockReturnValue({
            getUrlParams: vi.fn(() => [['keyword1'], 'test']),
        });
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationTotalByParams: 10 },
            refetch: refetchMock,
        });

        render(
            <VitalityAppListHeader onExportApplicationsClicked={mockOnExportApplicationsClicked} />,
        );

        expect(refetchMock).toHaveBeenCalledTimes(2); // Initial refetch

        (useNavigationAdapter as Mock).mockReturnValue({
            getUrlParams: vi.fn(() => [['keyword2'], 'test2']),
        });

        // Trigger a re-render with updated keywords and searchText
        render(
            <VitalityAppListHeader onExportApplicationsClicked={mockOnExportApplicationsClicked} />,
        );

        expect(refetchMock).toHaveBeenCalledTimes(4); // Refetch after props change
    });
});
