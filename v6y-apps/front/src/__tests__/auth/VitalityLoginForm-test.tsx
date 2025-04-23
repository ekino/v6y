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
        expect(screen.getByText('vitality.loginPage.formEmail.label')).toBeInTheDocument();
        expect(screen.getByText('vitality.loginPage.formPassword.label')).toBeInTheDocument();
        expect(screen.getByText('vitality.loginPage.formSubmit')).toBeInTheDocument();
    });

    it('should redirect when submitting with correct credentials', async () => {
        render(<VitalityLoginForm />);

        fireEvent.change(screen.getByTestId('mock-input-email'), {
            target: { value: 'test@test.test' },
        });
        fireEvent.change(screen.getByTestId('mock-input-password'), {
            target: { value: 'testtesttest' },
        });
        fireEvent.click(screen.getByText('vitality.loginPage.formSubmit'));

        await waitFor(() => {
            expect(
                screen.queryByText('vitality.loginPage.formEmail.warning'),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText('vitality.loginPage.formPassword.warning'),
            ).not.toBeInTheDocument();
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
        fireEvent.click(screen.getByText('vitality.loginPage.formSubmit'));

        await waitFor(() => {
            expect(
                screen.queryByText('vitality.loginPage.formEmail.warning'),
            ).not.toBeInTheDocument();
            expect(
                screen.getByText((content) =>
                    content.includes('vitality.loginPage.formPassword.warning'),
                ),
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
        fireEvent.click(screen.getByText('vitality.loginPage.formSubmit'));

        await waitFor(() => {
            expect(
                screen.getByText((content) =>
                    content.includes('vitality.loginPage.formEmail.warning'),
                ),
            ).toBeInTheDocument();

            expect(
                screen.queryByText((content) =>
                    content.includes('vitality.loginPage.formPassword.warning'),
                ),
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
        fireEvent.click(screen.getByText('vitality.loginPage.formSubmit'));

        await waitFor(() => {
            expect(
                screen.getByText((content) =>
                    content.includes('vitality.loginPage.formEmail.warning'),
                ),
            ).toBeInTheDocument();
            expect(
                screen.getByText((content) =>
                    content.includes('vitality.loginPage.formPassword.warning'),
                ),
            ).toBeInTheDocument();
        });
    });
});
