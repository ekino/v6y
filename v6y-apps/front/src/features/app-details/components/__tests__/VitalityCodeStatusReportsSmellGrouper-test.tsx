import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import VitalityCodeStatusReportsSmellGrouper from '../audit-reports/auditors/code-status/VitalityCodeStatusReportsSmellGrouper';

describe('VitalityCodeStatusReportsSmellGrouper', () => {
    const mockReports = [
        { category: 'security', id: 1 },
        { category: 'performance', id: 2 },
    ];

    it('should render the smell grouper and filter reports based on selected smells', () => {
        render(<VitalityCodeStatusReportsSmellGrouper reports={mockReports} />);

        // Check if the modules view is rendered
        expect(screen.getAllByRole('checkbox')?.length).toEqual(2);
        expect(screen.getByText('security')).toBeInTheDocument();
        expect(screen.getByText('performance')).toBeInTheDocument();

        // Verify if checkbox group is rendered
        const checkboxGroup = screen.getByRole('checkbox', { name: /security/i });
        expect(checkboxGroup).toBeInTheDocument();
    });

    it('should update selected smells state when user interacts with checkboxes', () => {
        render(<VitalityCodeStatusReportsSmellGrouper reports={mockReports} />);

        // Find checkbox
        const checkbox = screen.getByRole('checkbox', { name: /security/i });

        // Check and uncheck checkbox
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();

        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });

    it('should render no modules if no reports match the selected smells', () => {
        render(<VitalityCodeStatusReportsSmellGrouper reports={[]} />);

        // Verify no modules view is rendered
        expect(screen.queryAllByRole('checkbox')?.length).toEqual(0);
        expect(screen.queryByText('security')).not.toBeInTheDocument();
        expect(screen.queryByText('performance')).not.toBeInTheDocument();
    });
});
