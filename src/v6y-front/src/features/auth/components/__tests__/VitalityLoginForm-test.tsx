import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildClientQuery } from '../../../../infrastructure/adapters/api/useQueryAdapter';
import VitalityLoginForm from '../VitalityLoginForm';

// Mock useClientQuery
vi.mock('../../../../infrastructure/adapters/api/useQueryAdapter');

describe('VitalityLoginForm', () => {
    beforeEach(() => {
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
        expect(screen.getByText('Mot de passe')).toBeInTheDocument();
        expect(screen.getByText('Connexion')).toBeInTheDocument();
    });

    it('should fail when submitting with incorrect credentials', async () => {
        (buildClientQuery as Mock).mockReturnValue({ loginAccount: null });

        render(<VitalityLoginForm />);
        fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
            target: { value: 'test@test.test' },
        });
        fireEvent.change(screen.getByLabelText('Mot de passe', { selector: 'input' }), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByText('Connexion'));
        await waitFor(() => {
            expect(screen.getByText('Identifiants incorrects')).toBeInTheDocument();
        });
    });

    it('should redirect when submitting with correct credentials', async () => {
        render(<VitalityLoginForm />);
        fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
            target: { value: 'test@test.test' },
        });
        fireEvent.change(screen.getByLabelText('Mot de passe', { selector: 'input' }), {
            target: { value: 'test' },
        });
        fireEvent.click(screen.getByText('Connexion'));
        await waitFor(() => {
            expect(screen.getByText('Connexion réussie')).toBeInTheDocument();
        });
    });

    it('should call onFinishFailed when submitting the form with empty fields', async () => {
        render(<VitalityLoginForm />);
        fireEvent.click(screen.getByText('Connexion'));
        await waitFor(() => {
            expect(screen.getByText('Veuillez saisir votre email !')).toBeInTheDocument();
            expect(screen.getByText('Veuillez saisir votre mot de passe !')).toBeInTheDocument();
        });
    });
});
