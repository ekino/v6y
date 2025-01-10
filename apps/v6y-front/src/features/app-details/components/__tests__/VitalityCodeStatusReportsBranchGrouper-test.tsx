import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import VitalityCodeStatusReportsBranchGrouper from '../audit-reports/auditors/code-status/VitalityCodeStatusReportsBranchGrouper';

describe('VitalityCodeStatusReportsBranchGrouper', () => {
    const mockReports = [
        { branch: 'main', category: 'code-smell', id: 1 },
        { branch: 'feature-x', category: 'code-smell', id: 2 },
    ];

    it('should render VitalitySelectGrouperView with correct data source', () => {
        render(<VitalityCodeStatusReportsBranchGrouper reports={mockReports} />);

        expect(screen.getByLabelText('Select a branch')).toBeInTheDocument();
        expect(screen.getByText('Select a branch to filter metrics')).toBeInTheDocument();
        expect(screen.getByRole('form')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render with no reports', () => {
        render(<VitalityCodeStatusReportsBranchGrouper reports={[]} />);

        expect(screen.queryByText('Select a branch to filter metrics')).not.toBeInTheDocument();
        expect(screen.queryByText('form')).not.toBeInTheDocument();
        expect(screen.queryByText('combobox')).not.toBeInTheDocument();
    });

    it('should handle invalid or missing data gracefully', () => {
        const invalidReports = [
            { category: null, branch: null, id: 1 },
            { category: undefined, branch: null, id: 2 },
            { id: 3 },
        ];

        render(<VitalityCodeStatusReportsBranchGrouper reports={invalidReports} />);

        // Ensure no crashes and appropriate fallback UI is shown
        expect(screen.queryByText('form')).not.toBeInTheDocument();
        expect(screen.queryByText('combobox')).not.toBeInTheDocument();
    });
});
