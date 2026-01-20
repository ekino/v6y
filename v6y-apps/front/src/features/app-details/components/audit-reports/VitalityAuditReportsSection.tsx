import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types';

import VitalityAuditReportCard from './VitalityAuditReportCard';

interface VitalityAuditReportsSectionProps {
    title: string;
    reports: AuditType[];
    description: string;
}

const VitalityAuditReportsSection = ({
    title,
    reports,
    description,
}: VitalityAuditReportsSectionProps) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
                <div className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {reports.length} {reports.length === 1 ? 'report' : 'reports'}
                </div>
            </div>
            {reports.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-500 text-sm">
                        No reports available in this category
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <VitalityAuditReportCard key={report._id} report={report} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default VitalityAuditReportsSection;
