import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigationAdapter } from '@v6y/shared-ui';
import * as React from 'react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildClientQuery } from '../../../../infrastructure/adapters/api/useQueryAdapter';
import VitalityLoginForm from '../VitalityLoginForm';

// Mock useNavigationAdapter
vi.mock(import('@v6y/shared-ui'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigationAdapter: vi.fn(),
    };
});

// Mock useClientQuery
vi.mock('../../../../infrastructure/adapters/api/useQueryAdapter');

describe('VitalityLoginForm', () => {
    beforeEach(() => {
        (useNavigationAdapter as Mock).mockReturnValue({
            getUrlParams: vi.fn(() => [[], '']),
        });

        (buildClientQuery as Mock).mockReturnValue({
            loginAccount: {
                token: 'test',
                _id: 'test',
                role: 'test',
            },
        });
    });

    it('should render the component', () => {
        render(<VitalityLoginForm />);
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should fail when submitting with incorrect credentials', async () => {
        (buildClientQuery as Mock).mockReturnValue({ loginAccount: null });

        render(<VitalityLoginForm />);
        fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
            target: { value: 'test@test.test' },
        });
        fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(screen.getByText('Incorrect credentials')).toBeInTheDocument();
        });
    });

    it('should redirect when submitting with correct credentials', async () => {
        render(<VitalityLoginForm />);
        fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
            target: { value: 'test@test.test' },
        });
        fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
            target: { value: 'test' },
        });
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(screen.getByText('Successful connection')).toBeInTheDocument();
        });
    });

    it('should call onFinishFailed when submitting the form with empty fields', async () => {
        render(<VitalityLoginForm />);
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
            expect(screen.getByText('Please enter a password')).toBeInTheDocument();
        });
    });
});
