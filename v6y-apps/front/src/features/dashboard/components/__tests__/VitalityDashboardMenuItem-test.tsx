// VitalityDashboardMenuItem.test.tsx
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { DashboardItemType } from '../../../../commons/config/VitalityCommonConfig';
import VitalityDashboardMenuItem from '../VitalityDashboardMenuItem';

describe('VitalityDashboardMenuItem', () => {
    const mockOption: DashboardItemType = {
        autoFocus: true,
        defaultChecked: false,
        title: 'Test Item',
        description: 'Test description',
        url: '/test-url',
        avatar: <div>Test Avatar</div>,
        avatarColor: 'red',
    };

    it('should render the component with menu item details', () => {
        render(<VitalityDashboardMenuItem option={mockOption} />);

        expect(screen.getByRole('link')).toHaveAttribute('href', '/test-url');

        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should not render anything if option is null or undefined', () => {
        render(<VitalityDashboardMenuItem option={null} />);
        render(<VitalityDashboardMenuItem option={undefined} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
});
