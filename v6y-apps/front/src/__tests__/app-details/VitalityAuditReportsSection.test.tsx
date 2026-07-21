import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AuditType } from '@v6y/core-logic/src/types';

import VitalityAuditReportsSection from '../../features/app-details/components/audit-reports/VitalityAuditReportsSection';

vi.mock('recharts', () => ({
    Area: () => <g data-testid="area-series" />,
    AreaChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
    CartesianGrid: () => <g />,
    XAxis: () => <g />,
    YAxis: () => <g />,
    Pie: ({ children }: { children: React.ReactNode }) => (
        <g data-testid="pie-series">{children}</g>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
    Cell: () => <g />,
}));

vi.mock('../../features/app-details/components/audit-reports/VitalityAuditReportsSummary', () => ({
    default: () => <div data-testid="audit-reports-summary">Summary</div>,
}));

beforeAll(() => {
    vi.stubGlobal(
        'ResizeObserver',
        class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
});

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
    it('renders chart-first report overview for bundled metrics', () => {
        render(
            <VitalityAuditReportsSection
                title="Performance Metrics"
                description="Performance web, loading times and core web vitals"
                reports={Array.from({ length: 6 }, (_, index) => buildBundleReport(index + 1))}
            />,
        );

        expect(screen.getByText('Report health overview')).toBeInTheDocument();
        expect(screen.getByText('Status by metric family')).toBeInTheDocument();
        expect(screen.getByText('Priority findings')).toBeInTheDocument();
        expect(
            screen.getAllByText(
                (_, element) => element?.textContent?.includes('Critical: 0') ?? false,
            ).length,
        ).toBeGreaterThan(0);
    });

    it('surfaces warning and success statuses clearly', () => {
        render(
            <VitalityAuditReportsSection
                title="Performance Metrics"
                description="Performance web, loading times and core web vitals"
                reports={Array.from({ length: 6 }, (_, index) => buildPerformanceReport(index + 1))}
            />,
        );

        expect(screen.getByText(/critical: 0/i)).toBeInTheDocument();
        expect(screen.getByText(/warning: 3/i)).toBeInTheDocument();
        expect(screen.getByText(/healthy: 3/i)).toBeInTheDocument();
    });

    it('renders a pie chart instead of an area chart when chartVariant is pie', () => {
        render(
            <VitalityAuditReportsSection
                title="DevOps Metrics"
                description="DORA metrics"
                reports={Array.from({ length: 6 }, (_, index) => buildPerformanceReport(index + 1))}
                chartVariant="pie"
            />,
        );

        expect(screen.getByText('Status breakdown')).toBeInTheDocument();
        expect(screen.getByTestId('pie-series')).toBeInTheDocument();
        expect(screen.queryByTestId('area-series')).not.toBeInTheDocument();
    });
});
