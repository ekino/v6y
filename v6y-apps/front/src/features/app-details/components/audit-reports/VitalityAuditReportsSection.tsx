import * as React from 'react';
import { useState } from 'react';

import { AuditType } from '@v6y/core-logic/src/types';
import { Badge } from '@v6y/ui-kit-front';

interface VitalityAuditReportsSectionProps {
    title: string;
    reports: AuditType[];
    description: string;
}

const getStatusColor = (scoreStatus: string) => {
    switch (scoreStatus?.toLowerCase()) {
        case 'success':
            return 'bg-green-100 text-green-800';
        case 'warning':
            return 'bg-yellow-100 text-yellow-800';
        case 'error':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-slate-100 text-slate-800';
    }
};

const VitalityAuditReportsSection = ({
    title,
    reports,
    description,
}: VitalityAuditReportsSectionProps) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, reportId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(reportId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getLocationText = (report: AuditType) => {
        const parts = [];
        if (report.module?.branch) parts.push(report.module.branch);
        if (report.module?.path) parts.push(report.module.path);
        return parts.join(' - ');
    };

    if (!reports?.length) {
        return (
            <div className="mb-8">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No reports available in this category</p>
                </div>
            </div>
        );
    }

    // Group reports by category
    const groupedByCategory = reports.reduce(
        (acc, report) => {
            const category = report.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(report);
            return acc;
        },
        {} as Record<string, AuditType[]>,
    );

    return (
        <div className="mb-8">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(groupedByCategory).map(([category, categoryReports]) => (
                    <div key={category} className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-6 py-3 border-b">
                            <h4 className="font-semibold text-gray-900">{category}</h4>
                            <p className="text-xs text-gray-600 mt-1">
                                {categoryReports.length} item
                                {categoryReports.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full">
                                <thead className="bg-white border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700">
                                            Subcategory
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700">
                                            Location
                                        </th>
                                        <th className="text-center px-6 py-3 text-xs font-semibold text-gray-700">
                                            Score
                                        </th>
                                        <th className="text-center px-6 py-3 text-xs font-semibold text-gray-700">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryReports.map((report, index) => (
                                        <tr
                                            key={report._id}
                                            className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                                        >
                                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                                {report.subCategory || '-'}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <div className="max-w-[80px] truncate text-xs">
                                                        {report.module?.branch && (
                                                            <div>{report.module.branch}</div>
                                                        )}
                                                        {report.module?.path && (
                                                            <div className="text-gray-500 truncate">
                                                                {report.module.path}
                                                            </div>
                                                        )}
                                                        {!report.module?.branch &&
                                                            !report.module?.path && (
                                                                <span className="text-gray-400">
                                                                    -
                                                                </span>
                                                            )}
                                                    </div>
                                                    {(report.module?.branch ||
                                                        report.module?.path) && (
                                                        <button
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    getLocationText(report),
                                                                    report._id,
                                                                )
                                                            }
                                                            className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                                                            title="Copy location"
                                                        >
                                                            {copiedId === report._id ? (
                                                                <span className="text-xs text-green-600">
                                                                    ✓
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-500">
                                                                    📋
                                                                </span>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-center">
                                                {report.score !== undefined &&
                                                report.score !== null ? (
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {typeof report.score === 'number'
                                                                ? report.score.toFixed(1)
                                                                : report.score}
                                                        </div>
                                                        {report.scoreUnit && (
                                                            <div className="text-xs text-gray-500">
                                                                {report.scoreUnit}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-center">
                                                <Badge
                                                    className={getStatusColor(report.scoreStatus)}
                                                >
                                                    {report.scoreStatus || report.auditStatus}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>{' '}
                        </div>{' '}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VitalityAuditReportsSection;
