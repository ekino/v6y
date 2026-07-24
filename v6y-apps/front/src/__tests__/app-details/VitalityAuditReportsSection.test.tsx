import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AuditType } from '@v6y/core-logic/src/types';

import VitalityAuditReportsSection from '../../features/app-details/components/audit-reports/VitalityAuditReportsSection';

vi.mock('recharts', () => ({
    Radar: () => <g data-testid="radar-series" />,
    RadarChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
    PolarGrid: () => <g />,
    PolarAngleAxis: () => <g />,
    PolarRadiusAxis: () => <g />,
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

const buildMultiFamilyReport = (index: number): AuditType => {
    const categories = ['bundle-size', 'largest-contentful-paint', 'seo-index'];
    return {
        _id: index,
        type: 'Multi-Family',
        category: categories[index % categories.length],
        score: 90,
        scoreStatus: 'success',
        module: {
            path: `apps/front/file-${index}.tsx`,
        },
    };
};

const buildDoraReport = (index: number): AuditType => {
    const statuses = ['error', 'warning', 'success'];
    return {
        _id: index,
        type: 'DORA',
        category: 'DEPLOYMENT_FREQUENCY',
        score: 80,
        scoreStatus: statuses[index % statuses.length],
        module: {
            path: `apps/front/file-${index}.tsx`,
        },
    };
};

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

    it('renders a multi-series radar chart when there are enough metric families', () => {
        render(
            <VitalityAuditReportsSection
                title="Performance Metrics"
                description="Performance web, loading times and core web vitals"
                reports={Array.from({ length: 9 }, (_, index) => buildMultiFamilyReport(index + 1))}
            />,
        );

        expect(screen.getAllByTestId('radar-series').length).toBe(3);
    });

    it('falls back to a stacked-bar list when there are too few metric families for a radar', () => {
        render(
            <VitalityAuditReportsSection
                title="Performance Metrics"
                description="Performance web, loading times and core web vitals"
                reports={Array.from({ length: 6 }, (_, index) => buildBundleReport(index + 1))}
            />,
        );

        expect(screen.queryByTestId('radar-series')).not.toBeInTheDocument();
        expect(screen.getByText('Bundle analysis')).toBeInTheDocument();
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

    it('renders a single-series breakdown radar chart when all three statuses are present', () => {
        render(
            <VitalityAuditReportsSection
                title="DevOps Metrics"
                description="DORA metrics"
                reports={Array.from({ length: 9 }, (_, index) => buildDoraReport(index + 1))}
                chartVariant="breakdown"
            />,
        );

        expect(screen.getByText('Status breakdown')).toBeInTheDocument();
        expect(screen.getAllByTestId('radar-series').length).toBe(1);
    });

    it('falls back to a status bar when fewer than 3 statuses are present in breakdown mode', () => {
        render(
            <VitalityAuditReportsSection
                title="DevOps Metrics"
                description="DORA metrics"
                reports={Array.from({ length: 6 }, (_, index) => buildPerformanceReport(index + 1))}
                chartVariant="breakdown"
            />,
        );

        expect(screen.getByText('Status breakdown')).toBeInTheDocument();
        expect(screen.queryByTestId('radar-series')).not.toBeInTheDocument();
    });
});
