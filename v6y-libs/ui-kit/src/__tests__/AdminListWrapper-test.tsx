import { useTable } from '@refinedev/antd';
import '@testing-library/jest-dom/vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import AdminListWrapper from '../components/organisms/admin/AdminListWrapper';
import { renderWithQueryClientProvider } from '../test-utils/TestUtils';

vi.mock('../api', () => ({
    gqlClientRequest: vi.fn(),
}));

vi.mock('@refinedev/antd', async () => {
    const refineModule = await vi.importActual<typeof import('@refinedev/antd')>('@refinedev/antd');

    return {
        ...refineModule,
        useTable: vi.fn(() => ({
            tableQuery: {
                isLoading: false,
                isFetching: false,
                data: {
                    adminList: [
                        { id: '1', name: 'Admin One' },
                        { id: '2', name: 'Admin Two' },
                    ],
                },
                refetch: vi.fn(),
            },
        })),
    };
});

describe('AdminListWrapper', () => {
    it('should render the title', () => {
        renderWithQueryClientProvider(
            <AdminListWrapper
                title="Admin List"
                subTitle="Manage Admins"
                queryOptions={{
                    resource: 'adminList',
                    query: 'GET_ADMINS',
                    queryParams: {},
                }}
                defaultSorter={[]}
                renderContent={() => <div data-testid="content">Admin Content</div>}
            />,
        );

        expect(screen.getByText('Admin List')).toBeInTheDocument();
    });

    it('should show the loading state', () => {
        vi.mocked(useTable).mockReturnValueOnce({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            tableQuery: { isLoading: true, isFetching: true },
        });

        renderWithQueryClientProvider(
            <AdminListWrapper
                title="Admin List"
                subTitle="Manage Admins"
                queryOptions={{
                    resource: 'adminList',
                    query: 'GET_ADMINS',
                    queryParams: {},
                }}
                defaultSorter={[]}
                renderContent={() => <div data-testid="content">Admin Content</div>}
            />,
        );

        expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('should display admin data when loaded', async () => {
        renderWithQueryClientProvider(
            <AdminListWrapper
                title="Admin List"
                subTitle="Manage Admins"
                queryOptions={{
                    resource: 'adminList',
                    query: 'GET_ADMINS',
                    queryParams: {},
                }}
                defaultSorter={[]}
                renderContent={(data) => (
                    <ul>
                        {data.map((admin) => (
                            <li key={admin.id}>{admin.name}</li>
                        ))}
                    </ul>
                )}
            />,
        );

        await waitFor(() => {
            expect(screen.getByText('Admin One')).toBeInTheDocument();
            expect(screen.getByText('Admin Two')).toBeInTheDocument();
        });
    });

    it('should call refetch when refresh button is clicked', async () => {
        const user = userEvent.setup();
        const mockRefetch = vi.fn();

        vi.mocked(useTable).mockReturnValueOnce({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            tableQuery: {
                isLoading: false,
                isFetching: false,
                refetch: mockRefetch,
            },
        });

        renderWithQueryClientProvider(
            <AdminListWrapper
                title="Admin List"
                subTitle="Manage Admins"
                queryOptions={{
                    resource: 'adminList',
                    query: 'GET_ADMINS',
                    queryParams: {},
                }}
                defaultSorter={[]}
                renderContent={() => <div data-testid="content">Admin Content</div>}
            />,
        );

        await user.click(screen.getByRole('button', { name: /refresh/i }));

        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
});
