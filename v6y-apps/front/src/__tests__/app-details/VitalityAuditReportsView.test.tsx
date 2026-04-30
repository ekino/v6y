import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AuditType } from '@v6y/core-logic/src/types';

import VitalityAuditReportsView from '../../features/app-details/components/audit-reports/VitalityAuditReportsView';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('@v6y/ui-kit', async () => {
    const ReactModule = await vi.importActual<typeof import('react')>('react');

    return {
        DynamicLoader: (loader: () => Promise<{ default: React.ComponentType<unknown> }>) => {
            const LazyComponent = ReactModule.lazy(loader);

            return (props: Record<string, unknown>) => (
                <ReactModule.Suspense fallback={null}>
                    <LazyComponent {...props} />
                </ReactModule.Suspense>
            );
        },
        useNavigationAdapter: vi.fn(() => ({
            getUrlParams: () => ['123'],
        })),
        useTranslationProvider: vi.fn(() => ({
            translate: (key: string) => key,
        })),
    };
});

vi.mock(
    '../../features/app-details/components/audit-reports/VitalityAuditReportsTypeGrouper',
    () => ({
        default: ({ auditReports }: { auditReports: AuditType[] }) => (
            <div data-testid="audit-reports-type-grouper">
                {auditReports
                    .map((report) => `${report.module?.branch}:${report.category}`)
                    .join('|')}
            </div>
        ),
    }),
);

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    useClientQuery: vi.fn(),
    buildClientQuery: vi.fn(),
}));

const mockAuditReports: AuditType[] = [
    {
        _id: 1,
        type: 'Bundle-Analysis',
        category: 'bundle-size',
        module: {
            branch: 'myze-battery-main',
            path: 'apps/front/main.tsx',
        },
    },
    {
        _id: 2,
        type: 'Bundle-Analysis',
        category: 'bundle-size',
        module: {
            branch: 'myze-battery-develop',
            path: 'apps/front/dev.tsx',
        },
    },
    {
        _id: 3,
        type: 'Lighthouse',
        category: 'performance',
        scoreStatus: 'success',
        module: {
            branch: 'myze-battery-main',
            path: 'https://example.com/main',
        },
    },
    {
        _id: 4,
        type: 'Lighthouse',
        category: 'performance',
        scoreStatus: 'warning',
        module: {
            branch: 'myze-battery-develop',
            path: 'https://example.com/develop',
        },
    },
];

describe('VitalityAuditReportsView', () => {
    it('filters performance audit reports by the selected branch', async () => {
        vi.mocked(useClientQuery).mockReturnValue({
            isLoading: false,
            data: {
                getApplicationDetailsAuditReportsByParams: mockAuditReports,
            },
        } as unknown as ReturnType<typeof useClientQuery>);

        const { rerender } = render(
            <VitalityAuditReportsView category="performance" branch="main" />,
        );

        expect(await screen.findByTestId('audit-reports-type-grouper')).toHaveTextContent(
            'myze-battery-main:bundle-size|myze-battery-main:performance',
        );
        expect(screen.getByTestId('audit-reports-type-grouper')).not.toHaveTextContent('develop');

        rerender(
            <VitalityAuditReportsView category="performance" branch="develop" />,
        );

        expect(await screen.findByTestId('audit-reports-type-grouper')).toHaveTextContent(
            'myze-battery-develop:bundle-size|myze-battery-develop:performance',
        );
        expect(screen.getByTestId('audit-reports-type-grouper')).not.toHaveTextContent(
            'myze-battery-main',
        );
    });
});
