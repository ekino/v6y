import '@testing-library/jest-dom/vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { Mock, describe, expect, it, vi } from 'vitest';

import { gqlClientRequest } from '../api';
import { AdminSelectWrapper } from '../components/organisms';
import { renderWithQueryClientProvider } from '../test-utils/TestUtils';

vi.mock('../api', () => ({
    gqlClientRequest: vi.fn(),
}));

describe('AdminSelectWrapper', () => {
    it('should show loading state when fetching', async () => {
        (gqlClientRequest as Mock).mockReturnValue({
            isLoading: true,
            selectOptions: undefined,
            data: [],
        });

        await act(async () => {
            renderWithQueryClientProvider(
                <AdminSelectWrapper
                    title="Edit Admin"
                    queryOptions={{
                        resource: 'admin',
                        query: 'GET_ADMIN',
                        queryParams: {},
                    }}
                    mutationOptions={null}
                    createOptions={null}
                    selectOptions={{
                        resource: 'selectOptions',
                        query: 'GET_OPTIONS',
                        queryParams: {},
                    }}
                    renderSelectOption={() => [<div key="loading">Loading...</div>]}
                />,
            );
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display fetched select options', async () => {
        (gqlClientRequest as Mock).mockReturnValue({
            isLoading: false,
            selectOptions: [
                { id: '1', label: 'Option 1' },
                { id: '2', label: 'Option 2' },
            ],
            data: [],
        });

        await act(async () => {
            renderWithQueryClientProvider(
                <AdminSelectWrapper
                    title="Edit Admin"
                    queryOptions={{
                        resource: 'admin',
                        query: 'GET_ADMIN',
                        queryParams: {},
                        queryResource: 'admin',
                        queryFormAdapter: (data) => data,
                    }}
                    mutationOptions={null}
                    createOptions={null}
                    selectOptions={{
                        resource: 'selectOptions',
                        query: 'GET_OPTIONS',
                        queryParams: {},
                    }}
                    renderSelectOption={(data) =>
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        data?.map((option) => <div key={option.id}>{option.label}</div>)
                    }
                />,
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Option 1')).toBeInTheDocument();
            expect(screen.getByText('Option 2')).toBeInTheDocument();
        });
    });
});
