import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { AuditType } from '@v6y/core-logic/src/types';

import VitalityAuditReportsSection from '../../features/app-details/components/audit-reports/VitalityAuditReportsSection';

const buildBundleReport = (index: number): AuditType => ({
    _id: index,
    type: 'Bundle-Analysis',
    category: 'bundle-size',
    score: 42,
    scoreUnit: 'KB',
    module: {
        path: `apps/front/file-${index}.tsx`,
    },
});

const buildPerformanceReport = (index: number): AuditType => ({
    _id: index,
    type: 'Lighthouse',
    category: 'largest-contentful-paint',
    score: index % 2 === 0 ? 90 : 95,
    scoreStatus: index % 2 === 0 ? 'success' : 'warning',
    module: {
        path: `https://app.example.com/page-${index}`,
    },
});

describe('VitalityAuditReportsSection', () => {
    it('renders bundle analysis reports in the table layout', () => {
        render(
            <VitalityAuditReportsSection
                title="Performance Metrics"
                description="Performance web, loading times and core web vitals"
                reports={Array.from({ length: 6 }, (_, index) => buildBundleReport(index + 1))}
            />,
        );

        expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Location' })).toBeInTheDocument();
        expect(screen.getAllByText('bundle-size')).toHaveLength(6);
        expect(screen.queryByText('unknown')).not.toBeInTheDocument();
    });

    it('keeps dense layout for status-based performance metrics', () => {
        render(
            <VitalityAuditReportsSection
                title="Performance Metrics"
                description="Performance web, loading times and core web vitals"
                reports={Array.from({ length: 6 }, (_, index) => buildPerformanceReport(index + 1))}
            />,
        );

        expect(screen.queryByRole('columnheader', { name: 'Category' })).not.toBeInTheDocument();
        expect(screen.getByText('warning')).toBeInTheDocument();
        expect(screen.getByText('success')).toBeInTheDocument();
    });
});
