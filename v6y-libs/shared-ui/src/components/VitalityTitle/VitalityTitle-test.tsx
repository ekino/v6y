import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTranslation } from '../../hooks/useTranslation';
import { VitalityTitle } from './VitalityTitle';

// Mock useTranslation
vi.mock('../../hooks/useTranslation');

describe('VitalityTitle', () => {
    beforeEach(() => {
        (useTranslation as Mock).mockReturnValue({
            translate: (key: string) => key,
        });
    });

    it('should render the title', () => {
        render(<VitalityTitle title="Test Title" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render the translated title', () => {
        (useTranslation as Mock).mockReturnValue({
            translate: (key: string) => `Translated: ${key}`,
        });
        render(<VitalityTitle title="Test Title" />);
        expect(screen.getByText('Translated: Test Title')).toBeInTheDocument();
    });

    it('should render the subtitle', () => {
        render(<VitalityTitle title="Test Title" subTitle="Test Subtitle" />);
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should apply the correct level', () => {
        render(<VitalityTitle title="Test Title" level={3} />);
        const titleElement = screen.getByText('Test Title');
        expect(titleElement.tagName).toBe('H3');
    });

    /*it('should apply the underline style', () => {
        render(<VitalityTitle title="Test Title" underline />);
        const titleElement = screen.getByText('Test Title');
        expect(titleElement).toHaveStyle('text-decoration: underline');
    });

    it('should apply custom styles', () => {
        const customStyle = { color: 'red' };
        render(<VitalityTitle title="Test Title" style={customStyle} />);
        const titleElement = screen.getByText('Test Title');
        expect(titleElement).toHaveStyle('color: red');
    });*/
});
