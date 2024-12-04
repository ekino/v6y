// VitalityLighthouseReportsCategoryGrouper.test.tsx
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { AuditType } from '@v6y/commons';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useDataGrouper from '../../../../commons/hooks/useDataGrouper';
import VitalityLighthouseReportsCategoryGrouper from '../audit-reports/auditors/lighthouse/VitalityLighthouseReportsCategoryGrouper';

// Mock dynamic import to return the actual VitalityHelpView component
vi.mock('next/dynamic', () => ({
    default: vi.fn((callback) => callback().default),
}));

// Mock useDataGrouper hook
vi.mock('../../../../commons/hooks/useDataGrouper');

describe('VitalityLighthouseReportsCategoryGrouper', () => {
    const mockReports: AuditType[] = [
        {
            type: 'Performance',
            category: 'Category 1',
            subCategory: 'Subcategory 1',
            score: 80,
            scoreUnit: '%',
            status: 'success',
            auditHelp: {
                category: 'Help Category 1',
                title: 'Help Title 1',
                description: 'Help Description 1',
                explanation: 'Help Explanation 1',
            },
            module: {
                appId: 1,
                url: 'https://gitlab.ekino.com/renault/mfs/myze-battery',
                branch: '1-poc-auth-obtenir-un-jwt',
                path: '/Users/hela.ben-khalfallah/Desktop/github_workspace/v6y/src/code-analysis-workspace/mfs/1-poc-auth-obtenir-un-jwt/apps/front/package.json',
                status: 'outdated',
            },
        },
        {
            type: 'Accessibility',
            category: 'Category 2',
            subCategory: 'Subcategory 2',
            score: 60,
            scoreUnit: 'points',
            status: 'warning',
            auditHelp: {
                category: 'Help Category 2',
                title: 'Help Title 2',
                description: 'Help Description 2',
                explanation: 'Help Explanation 2',
            },
        },
        {
            type: 'SEO',
            category: 'Category 3',
            subCategory: 'Subcategory 3',
            score: 30,
            scoreUnit: 'points',
            status: 'error',
            auditHelp: {
                category: 'Help Category 3',
                title: 'Help Title 3',
                description: 'Help Description 3',
                explanation: 'Help Explanation 3',
            },
        },
    ];

    beforeEach(() => {
        useDataGrouper.mockReturnValue({
            groupedDataSource: {
                'Category 1': [mockReports[0]],
                'Category 2': [mockReports[1]],
                'Category 3': [mockReports[2]],
            },
            selectedCriteria: { key: '', label: undefined, value: '' },
            criteriaGroups: [],
            setSelectedCriteria: vi.fn(),
        });
    });

    it('should render the component with reports', () => {
        render(<VitalityLighthouseReportsCategoryGrouper reports={mockReports} />);

        expect(screen.getByText('Performance')).toBeInTheDocument();
        expect(screen.getByText('Accessibility')).toBeInTheDocument();
        expect(screen.getByText('SEO')).toBeInTheDocument();
    });

    it('should render report details correctly', () => {
        render(<VitalityLighthouseReportsCategoryGrouper reports={mockReports} />);

        // Check report 1 details
        expect(screen.getByText('Category: Category 1')).toBeInTheDocument();
        expect(screen.getByText('80')).toBeInTheDocument();

        // Check report 2 details
        expect(screen.getByText('Category: Category 2')).toBeInTheDocument();
        expect(screen.getByText('60')).toBeInTheDocument();

        // Check report 3 details
        expect(screen.getByText('Category: Category 3')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });
});
