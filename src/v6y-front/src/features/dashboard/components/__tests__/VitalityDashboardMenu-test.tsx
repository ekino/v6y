// VitalityDashboardMenu.test.tsx
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { VITALITY_DASHBOARD_DATASOURCE } from '../../../../commons/config/VitalityCommonConfig';
import VitalityDashboardMenu from '../VitalityDashboardMenu';

// Mock VitalityDashboardMenuItem
vi.mock('./VitalityDashboardMenuItem');

describe('VitalityDashboardMenu', () => {
    it('should render the component with menu items', () => {
        render(<VitalityDashboardMenu options={VITALITY_DASHBOARD_DATASOURCE} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(
            screen.getByText('Choose this option to view React applications.'),
        ).toBeInTheDocument();

        VITALITY_DASHBOARD_DATASOURCE.forEach((option) => {
            expect(screen.getByText(option.title)).toBeInTheDocument();
        });
    });

    it('should not render anything if options array is empty', () => {
        render(<VitalityDashboardMenu options={undefined} />);

        expect(screen.queryByText('React')).not.toBeInTheDocument();
        expect(screen.queryByText('Angular')).not.toBeInTheDocument();
        expect(screen.queryByText('React Legacy')).not.toBeInTheDocument();
        expect(screen.queryByText('Angular Legacy')).not.toBeInTheDocument();
    });
});
