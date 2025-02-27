import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityLoginForm from '../../features/auth/components/VitalityLoginForm';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => ({
    buildClientQuery: vi.fn(async ({ variables }) => {
        console.log('📡 Mock API Call:', variables);

        if (variables.input.password === 'test') {
            return {
                loginAccount: { token: 'test', _id: 'test', role: 'test' },
            };
        }

        return { loginAccount: null };
    }),
}));

describe('VitalityLoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the component', () => {
        render(<VitalityLoginForm />);
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should redirect when submitting with correct credentials', async () => {
        render(<VitalityLoginForm />);

        fireEvent.change(screen.getByTestId('mock-input-email'), {
            target: { value: 'test@test.test' },
        });
        fireEvent.change(screen.getByTestId('mock-input-password'), {
            target: { value: 'testtesttest' },
        });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(screen.queryByText('Please enter a valid email')).not.toBeInTheDocument();
            expect(screen.queryByText('Please enter a valid password')).not.toBeInTheDocument();
        });
    });

    it('should fail when submitting with incorrect password', async () => {
        render(<VitalityLoginForm />);
        fireEvent.change(screen.getByTestId('mock-input-email'), {
            target: { value: 'test@test.test' },
        });
        fireEvent.change(screen.getByTestId('mock-input-password'), {
            target: { value: 'xx' },
        });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(screen.queryByText('Please enter a valid email')).not.toBeInTheDocument();
            expect(
                screen.getByText((content) => content.includes('Please enter a valid password')),
            ).toBeInTheDocument();
        });
    });

    it('should fail when submitting with incorrect email', async () => {
        render(<VitalityLoginForm />);
        fireEvent.change(screen.getByTestId('mock-input-email'), {
            target: { value: 'test' },
        });
        fireEvent.change(screen.getByTestId('mock-input-password'), {
            target: { value: 'testtest' }, // 8 characters, so it's valid
        });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(
                screen.getByText((content) =>
                    content.includes('Please enter a valid email address'),
                ),
            ).toBeInTheDocument();

            expect(
                screen.queryByText((content) => content.includes('Please enter a valid password')),
            ).not.toBeInTheDocument();
        });
    });

    it('should fail when submitting with incorrect email and password', async () => {
        render(<VitalityLoginForm />);
        fireEvent.change(screen.getByTestId('mock-input-email'), {
            target: { value: 'test' },
        });
        fireEvent.change(screen.getByTestId('mock-input-password'), {
            target: { value: 'xx' },
        });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(
                screen.getByText((content) =>
                    content.includes('Please enter a valid email address'),
                ),
            ).toBeInTheDocument();
            expect(
                screen.getByText((content) => content.includes('Please enter a valid password')),
            ).toBeInTheDocument();
        });
    });
});
