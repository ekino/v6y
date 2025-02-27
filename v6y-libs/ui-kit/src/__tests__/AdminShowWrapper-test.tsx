import { useShow } from '@refinedev/core';
import '@testing-library/jest-dom/vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminShowWrapper } from '../components/organisms';
import { renderWithQueryClientProvider } from '../test-utils/TestUtils';

vi.mock('../api', () => ({
    gqlClientRequest: vi.fn(),
}));

vi.mock('@refinedev/core', async () => {
    const refineModule = await vi.importActual<typeof import('@refinedev/core')>('@refinedev/core');

    return {
        ...refineModule,
        useShow: vi.fn(() => ({
            query: {
                isLoading: true,
                isFetching: false,
                data: undefined,
                refetch: vi.fn(),
            },
        })),
    };
});

describe('AdminShowWrapper', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should render the correct content', async () => {
        (useShow as Mock).mockReturnValue({
            query: {
                isLoading: false,
                data: { admin: { id: '1', name: 'Test Admin' } },
            },
        });

        await act(async () => {
            renderWithQueryClientProvider(
                <AdminShowWrapper
                    title="Admin Details"
                    queryOptions={{
                        resource: 'admin',
                        query: 'GET_ADMIN',
                        queryParams: {},
                    }}
                    renderShowView={({ data }) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        return <div>{data?.name}</div>;
                    }}
                />,
            );
        });

        expect(screen.getByText('Admin Details')).toBeInTheDocument();
        expect(screen.getByText('Test Admin')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Refresh');
    });

    it('should show loading state when fetching', async () => {
        (useShow as Mock).mockReturnValue({
            query: {
                isLoading: true,
                data: null,
            },
        });

        await act(async () => {
            renderWithQueryClientProvider(
                <AdminShowWrapper
                    title="Admin Details"
                    queryOptions={{
                        resource: 'admin',
                        query: 'GET_ADMIN',
                        queryParams: {},
                    }}
                    renderShowView={() => <div>Loading...</div>}
                />,
            );
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error message when API fails', async () => {
        (useShow as Mock).mockReturnValue({
            query: {
                isLoading: false,
                data: { admin: { id: '1', name: 'Test Admin' } },
                error: {
                    message: 'Failed to fetch',
                },
            },
        });

        await act(async () => {
            renderWithQueryClientProvider(
                <AdminShowWrapper
                    title="Admin Details"
                    queryOptions={{
                        resource: 'admin',
                        query: 'GET_ADMIN',
                        queryParams: {},
                    }}
                    renderShowView={({ error }) => <div>{error?.message}</div>}
                />,
            );
        });

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
        });
    });

    it('should call refetch when refresh button is clicked', async () => {
        const mockRefetch = vi.fn();

        (useShow as Mock).mockReturnValue({
            query: {
                isLoading: false,
                data: { admin: { id: '1', name: 'Test Admin' } },
                refetch: mockRefetch,
            },
        });

        await act(async () => {
            renderWithQueryClientProvider(
                <AdminShowWrapper
                    title="Admin Details"
                    queryOptions={{
                        resource: 'admin',
                        query: 'GET_ADMIN',
                        queryParams: {},
                    }}
                    renderShowView={({ data }) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        return <div>{data?.name}</div>;
                    }}
                />,
            );
        });

        const refreshButton = screen.getByRole('button');
        await act(async () => {
            refreshButton.click();
        });

        expect(mockRefetch).toHaveBeenCalledTimes(1); // One for initial fetch, one for refetch
    });
});
