import '@testing-library/jest-dom/vitest';
import { within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import VitalityDashboardView from '../../features/dashboard/components/VitalityDashboardView';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

vi.mock('../../features/app-list/components/VitalityAppList', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-app-list">Mock App List</div>,
}));

describe('VitalityDashboardView', () => {
    it('wraps the app list inside a bordered panel', () => {
        const { container } = renderWithProviders(<VitalityDashboardView />);

        const sections = container.querySelectorAll('section');
        const appListSection = Array.from(sections).find((section) =>
            within(section).queryByTestId('mock-app-list'),
        );
        expect(appListSection).not.toBeUndefined();
        expect(within(appListSection as HTMLElement).getByTestId('mock-app-list')).toBeVisible();
        // Check for rounded corners (either rounded-lg from mobile or rounded-2xl from desktop)
        expect(appListSection).toHaveClass(/rounded-/);
        // Check for border styling
        expect(appListSection).toHaveClass('border');
        // Check for background styling
        expect(appListSection).toHaveClass('bg-white');
    });
});
