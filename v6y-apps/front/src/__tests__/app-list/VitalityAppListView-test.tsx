import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAppListView from '../../features/app-list/components/VitalityAppListView';

vi.mock('@v6y/ui-kit-front', async () => {
    const actual = await vi.importActual('@v6y/ui-kit-front');
    return {
        ...actual,
        useTranslationProvider: () => ({
            translate: (key: string) => key,
        }),
    };
});

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
    exportAppListDataToCSV: vi.fn(),
}));

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

    it('renders global filters and app list', async () => {
        render(<VitalityAppListView />);

        expect(screen.getByText('Global Filters')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Filter applications by reports volume, creation period and number of branches',
            ),
        ).toBeInTheDocument();

        expect(screen.getByLabelText('Min reports')).toBeInTheDocument();
        expect(screen.getByLabelText('Max reports')).toBeInTheDocument();
        expect(screen.getByLabelText('Min branches')).toBeInTheDocument();
        expect(screen.getByLabelText('Created from')).toBeInTheDocument();
        expect(screen.getByText('Quick focus')).toBeInTheDocument();
    });

    it('shows active filters count when global filters are set', async () => {
        render(<VitalityAppListView />);

        fireEvent.change(screen.getByLabelText('Min reports'), {
            target: { value: '2' },
        });
        fireEvent.change(screen.getByLabelText('Min branches'), {
            target: { value: '1' },
        });

        await waitFor(() => {
            expect(screen.getByText('Active Filters')).toBeInTheDocument();
            expect(screen.getByText('2 selected')).toBeInTheDocument();
        });
    });
});
