import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { AUDIT_REPORT_TYPES } from '../../../../commons/config/VitalityCommonConfig';
import VitalityTerms from '../../../../commons/config/VitalityTerms';
import { exportAppAuditReportsToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import { useClientQuery } from '../../../../infrastructure/adapters/api/useQueryAdapter';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter';
import VitalityAuditReportsView from '../audit-reports/VitalityAuditReportsView';

// Mock useClientQuery
vi.mock('../../../../infrastructure/adapters/api/useQueryAdapter');

// Mock useNavigationAdapter
vi.mock('../../../../infrastructure/adapters/navigation/useNavigationAdapter');

// Mock VitalityDataExportUtils
vi.mock('../../../../commons/utils/VitalityDataExportUtils');

describe('VitalityAuditReportsView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders empty state correctly', () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });

        (useNavigationAdapter as Mock).mockReturnValue({
            getUrlParams: () => ['1'],
        });

        render(<VitalityAuditReportsView />);

        expect(
            screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_REPORTS_TITLE),
        ).toBeInTheDocument();

        expect(screen.getAllByText('No data')?.[0]).toBeInTheDocument();
    });

    it('renders audit reports correctly', async () => {
        const mockReports = [
            {
                id: 1,
                type: AUDIT_REPORT_TYPES.lighthouse,
                category: 'first-contentful-paint',
                subCategory: 'mobile',
                auditHelp: {
                    category: 'Lighthouse-first-contentful-paint',
                    title: 'Default Title',
                    description: 'Default Description',
                    explanation: '',
                },
            },
            {
                id: 2,
                type: AUDIT_REPORT_TYPES.codeModularity,
                category: 'file-out-degree-centrality',
                subCategory: 'desktop',
                auditHelp: {
                    category: 'Code-Modularity-file-out-degree-centrality',
                    title: 'Default Title',
                    description: 'Default Description',
                    explanation: '',
                },
            },
        ];

        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsAuditReportsByParams: mockReports },
        });

        (useNavigationAdapter as Mock).mockReturnValue({
            getUrlParams: () => ['1'],
        });

        render(<VitalityAuditReportsView />);

        await waitFor(() =>
            expect(
                screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_REPORTS_TITLE),
            ).toBeInTheDocument(),
        );

        await waitFor(() => expect(screen.getByText('Lighthouse')).toBeInTheDocument());
        await waitFor(() =>
            expect(screen.getByText('Category: first-contentful-paint')).toBeInTheDocument(),
        );

        await waitFor(() => expect(screen.getByText('Code-Modularity')).toBeInTheDocument());

        const tabElement = screen.getAllByRole('tab')?.[1];

        fireEvent.click(tabElement);

        await waitFor(() =>
            expect(screen.getByText('file-out-degree-centrality')).toBeInTheDocument(),
        );
    });

    it('calls export function on export button click', () => {
        const mockReports = [
            {
                id: 1,
                type: 'lighthouse',
                auditHelp: { category: 'Performance', title: 'First Contentful Paint' },
            },
        ];

        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsAuditReportsByParams: mockReports },
        });
        (useNavigationAdapter as Mock).mockReturnValue({
            getUrlParams: () => ['1'],
        });

        render(<VitalityAuditReportsView />);

        const exportButton = screen.getByText(
            VitalityTerms.VITALITY_APP_DETAILS_AUDIT_REPORTS_EXPORT_LABEL,
        );

        fireEvent.click(exportButton);

        expect(exportAppAuditReportsToCSV).toHaveBeenCalledWith(mockReports);
    });
});
