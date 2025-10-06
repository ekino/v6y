import '@testing-library/jest-dom/vitest';
import { act, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminCreateWrapper } from '../components/organisms';
import { renderWithQueryClientProvider } from '../test-utils/TestUtils';

vi.mock('../api', () => ({
    gqlClientRequest: vi.fn().mockResolvedValue({ data: { id: '123' } }),
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
        })),
    };
});

describe('AdminCreateWrapper', () => {
    it('should renderWithQueryClientProvider the component with formItems', async () => {
        await act(async () => {
            renderWithQueryClientProvider(
                <AdminCreateWrapper
                    title="Create Admin"
                    createOptions={{
                        createQuery: 'CREATE_ADMIN',
                        createFormAdapter: vi.fn((data) => data),
                        createQueryParams: {},
                    }}
                    formItems={[<input key="1" data-testid="test-input" />]}
                />,
            );
        });

        expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('should not renderWithQueryClientProvider if formItems is empty', async () => {
        await act(async () => {
            renderWithQueryClientProvider(
                <AdminCreateWrapper title="Create Admin" createOptions={{}} formItems={[]} />,
            );
        });

        expect(screen.queryByTestId('test-input')).not.toBeInTheDocument();
    });
});
