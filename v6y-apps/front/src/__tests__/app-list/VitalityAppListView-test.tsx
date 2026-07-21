import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAppListView from '../../features/app-list/components/VitalityAppListView';

vi.mock('../../features/app-list/components/VitalityAppList', () => ({
    default: () => <div data-testid="mocked-app-list">Mocked App List</div>,
}));

describe('VitalityAppListView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('wraps the app list inside a bordered panel', () => {
        const { container } = render(<VitalityAppListView />);

        const section = container.querySelector('section');
        expect(section).not.toBeNull();
        expect(section).toHaveClass('rounded-xl');
        expect(section).toHaveClass('border-slate-200');
    });
});
