import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTranslationProvider } from '../../translation/useTranslationProvider';
import VitalityTitle from './VitalityTitle';

// Mock useTranslationProvider
vi.mock('../../translation/useTranslationProvider');

describe('VitalityTitle', () => {
    beforeEach(() => {
        (useTranslationProvider as Mock).mockReturnValue({
            translate: (key: string) => key,
        });
    });

    it('should render the title', () => {
        render(<VitalityTitle title="Test Title" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render the translated title', () => {
        (useTranslationProvider as Mock).mockReturnValue({
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
});
