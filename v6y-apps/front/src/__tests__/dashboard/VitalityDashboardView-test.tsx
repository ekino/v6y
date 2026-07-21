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

        const section = container.querySelector('section');
        expect(section).not.toBeNull();
        expect(section).toHaveClass('rounded-xl');
        expect(section).toHaveClass('border-slate-200');
    });
});
