import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types';
import { useTranslationProvider } from '@v6y/ui-kit-front';

import VitalityAuditReportsSection from './VitalityAuditReportsSection';

interface VitalityAuditReportsTypeGrouperProps {
    auditReports: AuditType[];
    category?: string;
}

const VitalityAuditReportsTypeGrouper = ({
    auditReports,
    category = 'general',
}: VitalityAuditReportsTypeGrouperProps) => {
    const { translate } = useTranslationProvider();

    const getTitleAndDescription = (cat: string) => {
        switch (cat) {
            case 'performance':
                return {
                    title: translate('vitality.appDetailsPage.auditReports.categories.performance'),
                    description: translate(
                        'vitality.appDetailsPage.auditReports.descriptions.performance',
                    ),
                };
            case 'accessibility':
                return {
                    title: translate(
                        'vitality.appDetailsPage.auditReports.categories.accessibility',
                    ),
                    description: translate(
                        'vitality.appDetailsPage.auditReports.descriptions.accessibility',
                    ),
                };
            case 'security':
                return {
                    title: translate('vitality.appDetailsPage.auditReports.categories.security'),
                    description: translate(
                        'vitality.appDetailsPage.auditReports.descriptions.security',
                    ),
                };
            case 'maintainability':
                return {
                    title: translate(
                        'vitality.appDetailsPage.auditReports.categories.maintainability',
                    ),
                    description: translate(
                        'vitality.appDetailsPage.auditReports.descriptions.maintainability',
                    ),
                };
            case 'dora':
                return {
                    title: translate('vitality.appDetailsPage.auditReports.categories.dora'),
                    description: translate(
                        'vitality.appDetailsPage.auditReports.descriptions.dora',
                    ),
                };
            default:
                return {
                    title: translate('vitality.appDetailsPage.auditReports.categories.general'),
                    description: translate(
                        'vitality.appDetailsPage.auditReports.descriptions.general',
                    ),
                };
        }
    };

    const { title, description } = getTitleAndDescription(category);

    return (
        <VitalityAuditReportsSection
            title={title}
            reports={auditReports}
            description={description}
            chartVariant={category === 'dora' ? 'pie' : 'area'}
            labels={{
                overviewTitle: translate(
                    'vitality.appDetailsPage.auditReports.visualization.overview',
                ),
                healthyLabel: translate(
                    'vitality.appDetailsPage.auditReports.visualization.healthy',
                ),
                warningLabel: translate(
                    'vitality.appDetailsPage.auditReports.visualization.warning',
                ),
                errorLabel: translate(
                    'vitality.appDetailsPage.auditReports.visualization.critical',
                ),
                attentionNeededLabel: translate(
                    'vitality.appDetailsPage.auditReports.visualization.attentionNeededLabel',
                ),
                statusByFamilyTitle: translate(
                    'vitality.appDetailsPage.auditReports.visualization.statusByFamilyTitle',
                ),
                statusByFamilyDescription: translate(
                    'vitality.appDetailsPage.auditReports.visualization.statusByFamilyDescription',
                ),
                statusBreakdownTitle: translate(
                    'vitality.appDetailsPage.auditReports.visualization.statusBreakdownTitle',
                ),
                statusBreakdownDescription: translate(
                    'vitality.appDetailsPage.auditReports.visualization.statusBreakdownDescription',
                ),
                priorityFindingsTitle: translate(
                    'vitality.appDetailsPage.auditReports.visualization.priorityFindingsTitle',
                ),
                priorityFindingsDescription: translate(
                    'vitality.appDetailsPage.auditReports.visualization.priorityFindingsDescription',
                ),
                noIssuesMessage: translate(
                    'vitality.appDetailsPage.auditReports.visualization.noIssuesMessage',
                ),
                impactedChecksLabel: translate(
                    'vitality.appDetailsPage.auditReports.visualization.impactedChecksLabel',
                ),
            }}
        />
    );
};

export default VitalityAuditReportsTypeGrouper;
