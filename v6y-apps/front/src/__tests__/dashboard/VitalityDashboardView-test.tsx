import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import VitalityDashboardView from '../../features/dashboard/components/VitalityDashboardView';

vi.mock('../../features/app-list/components/VitalityAppList', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-app-list">Mock App List</div>,
}));

describe('VitalityDashboardView', () => {
    it('wraps the app list inside a bordered panel', () => {
        const qc = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={qc}>
                <VitalityDashboardView />
            </QueryClientProvider>,
        );

        const sections = container.querySelectorAll('section');
        const appListSection = Array.from(sections).find((section) =>
            section.querySelector('[data-testid="mock-app-list"]'),
        );
        expect(appListSection).not.toBeUndefined();
        expect(appListSection).toHaveClass('rounded-2xl');
        expect(appListSection).toHaveClass('border-slate-200/80');
    });
});
