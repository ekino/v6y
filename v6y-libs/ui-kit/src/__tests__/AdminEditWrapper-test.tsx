import '@testing-library/jest-dom/vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AdminEditWrapper } from '../components/organisms';
import { renderWithQueryClientProvider } from '../test-utils/TestUtils';

vi.mock('../api', () => ({
    gqlClientRequest: vi.fn().mockResolvedValue({ data: { id: '123' } }),
}));

describe('AdminEditWrapper', () => {
    it('should render the form items', async () => {
        await act(async () => {
            renderWithQueryClientProvider(
                <AdminEditWrapper
                    title="Edit Admin"
                    queryOptions={{
                        resource: 'admin',
                        query: 'GET_ADMIN',
                        queryParams: { id: '123' },
                        queryFormAdapter: (data) => data, // Pass-through
                    }}
                    mutationOptions={{
                        resource: 'admin',
                        editQuery: 'EDIT_ADMIN',
                        editFormAdapter: (data) => data,
                        editQueryParams: {},
                    }}
                    formItems={[<input key="1" data-testid="test-input" />]}
                />,
            );
        });

        expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('should not render if formItems is empty', async () => {
        await act(async () => {
            renderWithQueryClientProvider(
                <AdminEditWrapper title="Edit Admin" queryOptions={{}} formItems={[]} />,
            );
        });

        expect(screen.queryByTestId('test-input')).not.toBeInTheDocument();
    });

    it('should populate form with fetched data', async () => {
        await act(async () => {
            renderWithQueryClientProvider(
                <AdminEditWrapper
                    title="Edit Admin"
                    queryOptions={{
                        resource: 'admin',
                        query: 'GET_ADMIN',
                        queryParams: { id: '123' },
                        queryFormAdapter: (data) => data,
                    }}
                    mutationOptions={{
                        resource: 'admin',
                        editQuery: 'EDIT_ADMIN',
                        editFormAdapter: (data) => data,
                        editQueryParams: {},
                    }}
                    formItems={[<input key="1" data-testid="test-input" />]}
                />,
            );
        });

        await waitFor(() => {
            expect(screen.getByTestId('test-input')).toBeInTheDocument();
        });
    });

    it('should show validation errors when required fields are empty', async () => {
        const user = userEvent.setup();

        renderWithQueryClientProvider(
            <AdminEditWrapper
                title="Edit Admin"
                queryOptions={{
                    resource: 'admin',
                    query: 'GET_ADMIN',
                    queryParams: { id: '123' },
                    queryFormAdapter: (data) => data,
                }}
                mutationOptions={{
                    resource: 'admin',
                    editQuery: 'EDIT_ADMIN',
                    editFormAdapter: (data) => data,
                    editQueryParams: {},
                }}
                formItems={[<input key="1" data-testid="test-input" required />]}
            />,
        );

        const input = screen.getByTestId('test-input');
        await user.clear(input);
        await user.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(screen.getByTestId('test-input')).toHaveAttribute('required', '');
        });
    });
});
