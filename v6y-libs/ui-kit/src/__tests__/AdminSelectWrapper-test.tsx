import '@testing-library/jest-dom/vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { Mock, describe, expect, it, vi } from 'vitest';

import { gqlClientRequest } from '../api';
import { AdminSelectWrapper } from '../components/organisms';
import { renderWithQueryClientProvider } from '../test-utils/TestUtils';

vi.mock('../api', () => ({
    gqlClientRequest: vi.fn(),
}));

vi.mock('@refinedev/antd', async () => {
    const refineModule = await vi.importActual<typeof import('@refinedev/antd')>('@refinedev/antd');

    return {
        ...refineModule,
        useForm: vi.fn(() => ({
            form: {
                getFieldsValue: vi.fn(() => ({})),
                setFieldsValue: vi.fn(),
            },
            formProps: {
                onFinish: vi.fn(),
            },
            saveButtonProps: {
                loading: false,
                onClick: vi.fn(),
            },
            query: {
                data: undefined,
                isLoading: true,
            },
        })),
        useSelect: vi.fn(() => ({
            query: {
                data: undefined,
                isLoading: true,
            },
        })),
    };
});

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
                    mutationOptions={undefined}
                    createOptions={undefined}
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
        // Update the mocks to return loaded state with options for this test
        const { useSelect, useForm } = await import('@refinedev/antd');
        
        vi.mocked(useForm).mockReturnValueOnce({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            form: {
                getFieldsValue: vi.fn(() => ({})),
                setFieldsValue: vi.fn(),
            },
            formProps: {
                onFinish: vi.fn(),
            },
            saveButtonProps: {
                loading: false,
                onClick: vi.fn(),
            },
            query: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                data: {
                    admin: { id: '1', name: 'Test Admin' },
                },
                isLoading: false,
            },
        });

        vi.mocked(useSelect).mockReturnValueOnce({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            query: {
                data: {
                    selectOptions: [
                        { id: '1', label: 'Option 1' },
                        { id: '2', label: 'Option 2' },
                    ],
                },
                isLoading: false,
            },
        });

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
                    mutationOptions={undefined}
                    createOptions={undefined}
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
