import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import VitalityTitle from './VitalityTitle';

describe('VitalityTitle', () => {
    it('should render the title', () => {
        render(<VitalityTitle title="Test Title" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render the translated title', () => {
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
