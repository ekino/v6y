import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types';
import { useTranslationProvider } from '@v6y/ui-kit';

import { categorizeAuditReports } from './VitalityAuditReportsFormatter';
import VitalityAuditReportsSection from './VitalityAuditReportsSection';

const VitalityAuditReportsTypeGrouper = ({ auditReports }: { auditReports: AuditType[] }) => {
    const { translate } = useTranslationProvider();

    const categorized = categorizeAuditReports(auditReports);

    return (
        <div className="space-y-8">
            <VitalityAuditReportsSection
                title={translate('vitality.appDetailsPage.auditReports.categories.devops')}
                reports={categorized.devops}
                description="DORA metrics, deployment frequency, lead time measurements"
            />
            <VitalityAuditReportsSection
                title={translate('vitality.appDetailsPage.auditReports.categories.static')}
                reports={categorized.static}
                description="Code quality, security vulnerabilities, maintainability metrics"
            />
            <VitalityAuditReportsSection
                title={translate('vitality.appDetailsPage.auditReports.categories.dynamic')}
                reports={categorized.dynamic}
                description="Performance tests, accessibility audits, runtime analysis"
            />
        </div>
    );
};

export default VitalityAuditReportsTypeGrouper;
