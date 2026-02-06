import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types';

import VitalityAuditReportsSection from './VitalityAuditReportsSection';

interface VitalityAuditReportsTypeGrouperProps {
    auditReports: AuditType[];
    category?: string;
}

const VitalityAuditReportsTypeGrouper = ({
    auditReports,
    category = 'general',
}: VitalityAuditReportsTypeGrouperProps) => {
    const getTitleAndDescription = (cat: string) => {
        switch (cat) {
            case 'performance':
                return {
                    title: 'Performance Metrics',
                    description: 'Web performance, loading times, Core Web Vitals',
                };
            case 'accessibility':
                return {
                    title: 'Accessibility & Quality',
                    description:
                        'WCAG compliance, screen reader compatibility, accessibility standards',
                };
            case 'security':
                return {
                    title: 'Security Analysis',
                    description: 'Security vulnerabilities, insecure patterns, code smells',
                };
            case 'maintainability':
                return {
                    title: 'Code Quality & Maintainability',
                    description: 'Code complexity, coupling, metrics and quality assessments',
                };
            default:
                return {
                    title: 'Audit Reports',
                    description: 'Analysis results',
                };
        }
    };

    const { title, description } = getTitleAndDescription(category);

    return (
        <VitalityAuditReportsSection
            title={title}
            reports={auditReports}
            description={description}
        />
    );
};

export default VitalityAuditReportsTypeGrouper;
