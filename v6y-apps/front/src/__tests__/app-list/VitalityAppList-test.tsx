import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';

import VitalityAppList from '../../features/app-list/components/VitalityAppList';
import VitalityAppListHeader from '../../features/app-list/components/VitalityAppListHeader';
import { useClientQuery } from '../../infrastructure/adapters/api/useQueryAdapter';

describe('VitalityAppList', () => {
    it('renders applications when data is available', async () => {
        (useClientQuery as Mock).mockReturnValueOnce({
            isLoading: false,
            isFetching: false,
            data: {
                getApplicationListByPageAndParams: [{ _id: 1, name: 'Vitality App' }],
            },
        });

        render(<VitalityAppList />);

        await waitFor(() => {
            const appNames = screen.getAllByTestId('app-name');
            expect(appNames.length).toBeGreaterThan(0);
            expect(appNames[0]).toHaveTextContent('Vitality App');
        });
    });

    it('handles empty application list gracefully', async () => {
        (useClientQuery as Mock).mockReturnValueOnce({
            isLoading: false,
            isFetching: false,
            data: {
                getApplicationListByPageAndParams: [],
            },
        });

        render(<VitalityAppList />);

        await waitFor(() => {
            expect(screen.getByText('vitality.appListPage.empty')).toBeInTheDocument();
        });
    });

    it('shows total applications count when data is available', async () => {
        render(<VitalityAppListHeader appsTotal={25} />);

        await waitFor(() => {
            expect(screen.getByText('25 results')).toBeInTheDocument();
        });
    });

    it('renders each application returned by the query', async () => {
        (useClientQuery as Mock).mockReturnValueOnce({
            isLoading: false,
            isFetching: false,
            data: {
                getApplicationListByPageAndParams: [{ _id: 3, name: 'Filtered App' }],
            },
        });

        render(<VitalityAppList />);

        await waitFor(() => {
            const appNames = screen.getAllByTestId('app-name');
            expect(appNames.length).toBeGreaterThan(0);
            expect(appNames[0]).toHaveTextContent('Filtered App');
        });
    });
});
