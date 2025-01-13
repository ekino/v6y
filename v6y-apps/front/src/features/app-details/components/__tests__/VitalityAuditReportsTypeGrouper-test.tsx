import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AUDIT_REPORT_TYPES } from '../../../../commons/config/VitalityCommonConfig';
import VitalityAuditReportsTypeGrouper from '../audit-reports/VitalityAuditReportsTypeGrouper';

describe('VitalityAuditReportsTypeGrouper', () => {
    it('should render the correct grouper based on the report type', () => {
        const auditReports = [
            { type: AUDIT_REPORT_TYPES.lighthouse, id: 1 },
            { type: AUDIT_REPORT_TYPES.codeModularity, id: 2 },
        ];

        render(<VitalityAuditReportsTypeGrouper auditReports={auditReports} />);

        // Verify Lighthouse Grouper is rendered
        expect(screen.queryByText('Lighthouse')).toBeInTheDocument();

        // Verify Code Status Grouper is rendered
        expect(screen.queryByText('Code-Modularity')).toBeInTheDocument();
    });

    it('should not render the groupers if there are no reports', () => {
        render(<VitalityAuditReportsTypeGrouper auditReports={[]} />);

        expect(screen.queryByText('Lighthouse')).not.toBeInTheDocument();
        expect(screen.queryByText('Code-Modularity')).not.toBeInTheDocument();
    });

    it('should only render VitalityLighthouseReportsDeviceGrouper for lighthouse reports', () => {
        const auditReports = [{ type: AUDIT_REPORT_TYPES.lighthouse, id: 1 }];

        render(<VitalityAuditReportsTypeGrouper auditReports={auditReports} />);

        expect(screen.queryByText('Lighthouse')).toBeInTheDocument();
        expect(screen.queryByText('Code-Modularity')).not.toBeInTheDocument();
    });

    it('should only render VitalityCodeStatusReportsBranchGrouper for codeModularity reports', () => {
        const auditReports = [{ type: AUDIT_REPORT_TYPES.codeModularity, id: 1 }];

        render(<VitalityAuditReportsTypeGrouper auditReports={auditReports} />);

        expect(screen.queryByText('Lighthouse')).not.toBeInTheDocument();
        expect(screen.queryByText('Code-Modularity')).toBeInTheDocument();
    });

    it('should render multiple VitalityCodeStatusReportsBranchGrouper components', () => {
        const auditReports = [
            { type: AUDIT_REPORT_TYPES.codeModularity, id: 1 },
            { type: AUDIT_REPORT_TYPES.codeComplexity, id: 2 },
        ];

        render(<VitalityAuditReportsTypeGrouper auditReports={auditReports} />);

        expect(screen.queryByText('Code-Modularity')).toBeInTheDocument();
        expect(screen.queryByText('Code-Complexity')).toBeInTheDocument();
    });

    it('should render multiple VitalityLighthouseReportsDeviceGrouper components', () => {
        const auditReports = [
            { type: AUDIT_REPORT_TYPES.lighthouse, id: 1 },
            { type: AUDIT_REPORT_TYPES.lighthouse, id: 2 },
        ];

        render(<VitalityAuditReportsTypeGrouper auditReports={auditReports} />);

        expect(screen.getAllByText('Lighthouse').length).toBe(1);
    });

    it('should not render anything if auditReports is undefined', () => {
        render(<VitalityAuditReportsTypeGrouper auditReports={undefined} />);

        expect(screen.queryByTestId('lighthouse-grouper')).not.toBeInTheDocument();
        expect(screen.queryByTestId('code-status-grouper')).not.toBeInTheDocument();
    });

    it('should not render anything if an unsupported report type is passed', () => {
        const auditReports = [{ type: 'unknown_type', id: 1 }];

        render(<VitalityAuditReportsTypeGrouper auditReports={auditReports} />);

        expect(screen.queryByTestId('lighthouse-grouper')).not.toBeInTheDocument();
        expect(screen.queryByTestId('code-status-grouper')).not.toBeInTheDocument();
    });
});
