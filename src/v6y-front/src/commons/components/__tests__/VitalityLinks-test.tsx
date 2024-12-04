// VitalityLinks.test.tsx
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import VitalityLinks from '../VitalityLinks';

describe('VitalityLinks', () => {
    const mockLinks = [
        {
            label: 'Link 1',
            value: 'https://link1.com',
        },
        {
            label: 'Link 2',
            value: 'https://link2.com',
        },
    ];

    it('should render the component with links', () => {
        render(<VitalityLinks links={mockLinks} />);

        expect(screen.getByText('Link 1')).toBeInTheDocument();
        expect(screen.getByText('Link 2')).toBeInTheDocument();
    });

    it('should render links with correct href and target', () => {
        render(<VitalityLinks links={mockLinks} />);

        const link1Element = screen.getByText('Link 1').closest('a');
        expect(link1Element).toHaveAttribute('href', 'https://link1.com');
        expect(link1Element).toHaveAttribute('target', '_blank');
        expect(link1Element).toHaveAttribute('rel', 'noopener noreferrer');

        const link2Element = screen.getByText('Link 2').closest('a');
        expect(link2Element).toHaveAttribute('href', 'https://link2.com');
        expect(link2Element).toHaveAttribute('target', '_blank');
        expect(link2Element).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not render links with missing label or value', () => {
        const mockLinksWithMissingData = [
            {
                label: '',
                value: 'https://link1.com',
            },
            {
                label: 'Link 2',
                value: '',
            },
        ];

        render(<VitalityLinks links={mockLinksWithMissingData} />);

        expect(screen.queryByText('Link 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Link 2')).not.toBeInTheDocument();
    });

    it('should not render anything if links array is empty or null', () => {
        render(<VitalityLinks links={[]} />);
        render(<VitalityLinks links={null} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should apply the correct alignment', () => {
        render(<VitalityLinks links={mockLinks} align="center" />);
        expect(screen.getAllByRole('link')).toHaveLength(2);
    });
});
