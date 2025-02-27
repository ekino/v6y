import '@testing-library/jest-dom/vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import VitalityAuditReportsView from '../../features/app-details/components/audit-reports/VitalityAuditReportsView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
}));

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppAuditReportsToCSV: vi.fn(),
}));

const auditReports = {
    isLoading: false,
    data: {
        getApplicationDetailsAuditReportsByParams: [
            {
                _id: '1',
                type: 'Code-Security',
                category: 'Code-Security', //  Moved from auditHelp
                subCategory: 'Static Analysis', //  Added for completeness
                status: 'Completed',
                score: 85, //  Added for completeness
                scoreUnit: '%', //  Added for completeness
                extraInfos: 'Some additional details.', //  Added for completeness
                dateStart: '2025-02-20',
                dateEnd: '2025-02-21',
                auditHelp: {
                    _id: 'h1',
                    title: 'Security Audit',
                    category: 'Code-Security',
                    description: 'Detailed security audit.',
                    explanation: 'This audit checks for security vulnerabilities.',
                },
                module: {
                    branch: 'main',
                    path: 'src/security',
                    url: 'https://repo.example.com/module-a',
                },
            },
            {
                _id: '2',
                type: 'Lighthouse',
                category: 'Lighthouse', //  Moved from auditHelp
                subCategory: 'Performance', //  Added for completeness
                status: 'Completed',
                score: 92, //  Added for completeness
                scoreUnit: '%', //  Added for completeness
                extraInfos: 'Page load speed and performance audit.', //  Added for completeness
                dateStart: '2025-02-25',
                dateEnd: '2025-02-26',
                auditHelp: {
                    _id: 'h2',
                    title: 'Lighthouse Performance Audit',
                    category: 'Lighthouse',
                    description: 'Performance analysis results.',
                    explanation: 'This audit evaluates page speed and performance optimizations.',
                },
                module: {
                    branch: 'develop',
                    path: 'src/performance',
                    url: 'https://repo.example.com/module-b',
                },
            },
        ],
    },
};

describe('VitalityAuditReportsView', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    beforeAll(() => {
        // Mock `requestSubmit` globally
        HTMLFormElement.prototype.requestSubmit = vi.fn();
    });

    it('shows loading state until data is available', async () => {
        (useClientQuery as Mock).mockReturnValue({ isLoading: true, data: null });

        await act(async () => {
            render(<VitalityAuditReportsView />);
        });

        expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    });

    it('renders audit reports when data is fetched successfully', async () => {
        (useClientQuery as Mock).mockReturnValue(auditReports);

        await act(async () => {
            render(<VitalityAuditReportsView />);
        });

        // Wait for rendering
        await waitFor(() => {
            expect(screen.getByTestId('audit_reports_grouper_tab')).toBeInTheDocument();
            expect(screen.getByTestId('audit_reports_grouper_tab_content')).toBeInTheDocument();
            expect(screen.getByText('Lighthouse')).toBeInTheDocument();
            expect(screen.getByText('Code-Security')).toBeInTheDocument();
        });
    });

    it('groups audit reports by category correctly', async () => {
        (useClientQuery as Mock).mockReturnValue(auditReports);

        await act(async () => {
            render(<VitalityAuditReportsView />);
        });

        await waitFor(() => {
            expect(screen.getByText('Code-Security')).toBeInTheDocument();
            expect(screen.getByText('Lighthouse')).toBeInTheDocument();
        });
    });

    it('displays loading indicator while fetching data', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: true,
            data: null,
        });

        await act(async () => {
            render(<VitalityAuditReportsView />);
        });

        expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
    });

    it('shows "No Data Available" when there are no audit reports', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });

        await act(async () => {
            render(<VitalityAuditReportsView />);
        });

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });

    it('handles reports with missing category or auditHelp fields', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsAuditReportsByParams: [
                    {
                        _id: '3',
                        type: 'Performance',
                        status: 'Pending',
                        dateStart: '2025-02-27',
                        dateEnd: '2025-02-28',
                        // ❌ Missing category
                        auditHelp: null,
                        module: { name: 'Module C', branch: 'feature' },
                    },
                ],
            },
        });

        await act(async () => {
            render(<VitalityAuditReportsView />);
        });

        expect(screen.getByText('No Data Available')).toBeInTheDocument();
        expect(screen.getByTestId('empty-view')).toBeInTheDocument();
    });

    it('displays empty state when no reports exist', async () => {
        (useClientQuery as Mock).mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsAuditReportsByParams: [] },
        });

        await act(async () => {
            render(<VitalityAuditReportsView />);
        });

        await waitFor(() => {
            expect(screen.getByTestId('empty-view')).toBeInTheDocument();
        });
    });
});
