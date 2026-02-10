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

const getCategoryGroup = (category: string): string => {
    const cat = category?.toLowerCase() || '';
    // Group similar metrics together
    if (cat.startsWith('halstead-')) return 'Halstead Metrics';
    if (cat.includes('maintainability') || cat.includes('complexity'))
        return 'Complexity & Maintainability';
    if (cat.includes('coupling') || cat.includes('modularity')) return 'Coupling & Modularity';
    if (cat.includes('duplication')) return 'Code Duplication';
    if (cat.includes('instability')) return 'Instability Metrics';
    if (
        cat.includes('performance') ||
        cat.includes('speed') ||
        cat.includes('blocking') ||
        cat.includes('largest-contentful') ||
        cat.includes('cumulative-layout')
    )
        return 'Performance Metrics';
    if (cat.includes('seo') || cat.includes('search')) return 'SEO & Search';
    if (
        cat.includes('dora') ||
        cat === 'devops' ||
        category === 'DEPLOYMENT_FREQUENCY' ||
        category === 'LEAD_REVIEW_TIME' ||
        category === 'LEAD_TIME_FOR_CHANGES' ||
        category === 'CHANGE_FAILURE_RATE' ||
        category === 'MEAN_TIME_TO_RESTORE_SERVICE' ||
        category === 'UP_TIME_AVERAGE'
    )
        return 'DevOps (DORA)';
    if (cat.includes('bundle') || cat.includes('size')) return 'Bundle Analysis';
    if (cat.startsWith('commons-') || cat.startsWith('react-') || cat.startsWith('angular-'))
        return 'Security Smells';
    return category || 'Uncategorized';
};

const isDenseMetric = (reports: AuditType[]): boolean => {
    if (reports.length < 5) return false;

    // Don't use dense display for these categories
    const excludeFromDense = reports.some((r) => {
        const cat = r.category?.toLowerCase() || '';
        return (
            cat.startsWith('commons-') ||
            cat.startsWith('react-') ||
            cat.startsWith('angular-') ||
            cat.includes('accessibility') ||
            cat.includes('security') ||
            cat.includes('seo') ||
            r.type === 'DORA' ||
            cat.includes('dora')
        );
    });
    if (excludeFromDense) return false;

    // Check if most reports have the same score
    const scores = reports.map((r) => String(r.score));
    const uniqueScores = new Set(scores);
    return uniqueScores.size <= 2; // Max 2 different score values for dense metric
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

    // Group reports by category group
    const groupedByGroup = reports.reduce(
        (acc, report) => {
            const group = getCategoryGroup(report.category || '');
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(report);
            return acc;
        },
        {} as Record<string, AuditType[]>,
    );

    console.log('Grouped Reports:', groupedByGroup);

    return (
        <div className="mb-8">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(groupedByGroup).map(([group, groupReports]) => {
                    const denseMetric = isDenseMetric(groupReports);

                    console.log(denseMetric);

                    if (denseMetric) {
                        // Group by status for dense metrics
                        const byStatus = groupReports.reduce(
                            (acc, report) => {
                                const status = report.scoreStatus || 'unknown';
                                if (!acc[status]) {
                                    acc[status] = [];
                                }
                                acc[status].push(report);
                                return acc;
                            },
                            {} as Record<string, AuditType[]>,
                        );

                        return (
                            <div key={group} className="border rounded-lg overflow-hidden">
                                <div className="bg-slate-50 px-6 py-3 border-b">
                                    <h4 className="font-semibold text-gray-900">{group}</h4>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {groupReports.length} files
                                    </p>
                                </div>
                                <div className="p-6 space-y-4">
                                    {Object.entries(byStatus).map(([status, statusReports]) => (
                                        <div key={status}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={getStatusColor(status)}>
                                                    {status}
                                                </Badge>
                                                <span className="text-sm text-gray-600">
                                                    {statusReports.length} file
                                                    {statusReports.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="ml-4 space-y-1">
                                                {statusReports.map((report) => (
                                                    <div
                                                        key={report._id}
                                                        className="text-sm text-gray-700 font-medium truncate"
                                                        title={report.module?.path}
                                                    >
                                                        {report.module?.path ||
                                                            report.module?.branch ||
                                                            '-'}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={group} className="border rounded-lg overflow-hidden">
                            <div className="bg-slate-50 px-6 py-3 border-b">
                                <h4 className="font-semibold text-gray-900">{group}</h4>
                                <p className="text-xs text-gray-600 mt-1">
                                    {groupReports.length} item
                                    {groupReports.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-full">
                                    <thead className="bg-white border-b border-slate-200">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700">
                                                Category
                                            </th>
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
                                        {groupReports.map((report, index) => (
                                            <tr
                                                key={report._id}
                                                className={
                                                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                                }
                                            >
                                                <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                                    {report.category || 'Uncategorized'}
                                                </td>
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
                                                                        String(report._id),
                                                                    )
                                                                }
                                                                className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                                                                title="Copy location"
                                                            >
                                                                {copiedId === String(report._id) ? (
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
                                                        className={getStatusColor(
                                                            report.scoreStatus || '',
                                                        )}
                                                    >
                                                        {report.scoreStatus || report.auditStatus}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VitalityAuditReportsSection;
