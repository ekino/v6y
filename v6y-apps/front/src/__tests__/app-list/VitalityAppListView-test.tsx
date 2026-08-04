import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
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

    it('renders the application list', async () => {
        render(<VitalityAppListView />);

        expect(await screen.findByTestId('mocked-app-list')).toBeVisible();
    });
});
