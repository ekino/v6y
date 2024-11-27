import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';

import VitalityLoginForm from '../VitalityLoginForm';

describe('VitalityLoginForm', () => {
    it('should render the component', () => {
        render(<VitalityLoginForm />);
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Remember me')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should call onFinish when submitting the form', () => {
        const onFinish = vi.fn();
        render(<VitalityLoginForm />);
        expect(onFinish).not.toHaveBeenCalled();
        screen.getByRole('button', { name: /submit/i }).click();
        expect(onFinish).toHaveBeenCalled();
    });

    it('should call onFinishFailed when submitting the form with empty fields', () => {
        const onFinishFailed = vi.fn();
        render(<VitalityLoginForm />);
        expect(onFinishFailed).not.toHaveBeenCalled();
        screen.getByRole('button', { name: /submit/i }).click();
        expect(onFinishFailed).toHaveBeenCalled();
    });
});

