import '@testing-library/jest-dom/vitest';
import { act, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminCreateWrapper } from '../components/organisms';
import { renderWithQueryClientProvider } from '../test-utils/TestUtils';

vi.mock('../api', () => ({
    gqlClientRequest: vi.fn().mockResolvedValue({ data: { id: '123' } }),
}));

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
