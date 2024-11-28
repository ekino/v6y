import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import VitalityAuditReportsView from '../audit-reports/VitalityAuditReportsView';
import { useClientQuery } from '../../../../infrastructure/adapters/api/useQueryAdapter';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter';
import { exportAppAuditReportsToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import VitalityTerms from '../../../../commons/config/VitalityTerms';

// vi.mock('next/dynamic', () => ({
//     default: vi.fn((callback) => callback().default),
// }));

// Mock useClientQuery
vi.mock('../../../../infrastructure/adapters/api/useQueryAdapter');
// Mock useNavigationAdapter
vi.mock('../../../../infrastructure/adapters/navigation/useNavigationAdapter');

vi.mock('../../../../commons/utils/VitalityDataExportUtils');

describe('VitalityAuditReportsView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders empty state correctly', () => {
        useClientQuery.mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });
        useNavigationAdapter.mockReturnValue({
            getUrlParams: () => ['1'],
        });

        render(<VitalityAuditReportsView />);

        expect(screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_REPORTS_TITLE)).toBeInTheDocument();
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders audit reports correctly', () => {
        const mockReports = [
            { id: 1, type: 'lighthouse', auditHelp: { category: 'Performance', title: 'First Contentful Paint' } },
            { id: 2, type: 'codeModularity', auditHelp: { category: 'Code Quality', title: 'Modularity' } },
        ];

        useClientQuery.mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsAuditReportsByParams: mockReports },
        });
        useNavigationAdapter.mockReturnValue({
            getUrlParams: () => ['1'],
        });

        render(<VitalityAuditReportsView />);

        expect(screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_REPORTS_TITLE)).toBeInTheDocument();
        expect(screen.getByText('First Contentful Paint')).toBeInTheDocument();
        expect(screen.getByText('Modularity')).toBeInTheDocument();
    });

    it('calls export function on export button click', () => {
        const mockReports = [
            { id: 1, type: 'lighthouse', auditHelp: { category: 'Performance', title: 'First Contentful Paint' } },
        ];

        useClientQuery.mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsAuditReportsByParams: mockReports },
        });
        useNavigationAdapter.mockReturnValue({
            getUrlParams: () => ['1'],
        });

        render(<VitalityAuditReportsView />);

        const exportButton = screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_REPORTS_EXPORT_LABEL);
        fireEvent.click(exportButton);

        expect(exportAppAuditReportsToCSV).toHaveBeenCalledWith(mockReports);
    });
});