import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import { getScoreStatusColor } from '../../../../commons/utils/StatusUtils';

interface VitalityAuditReportCardProps {
    report: AuditType;
}

const VitalityAuditReportCard = ({ report }: VitalityAuditReportCardProps) => {
    const { translate } = useTranslationProvider();

    const getDisplayName = (category: string) => {
        const translationKey = `vitality.appDetailsPage.auditReports.doraMetrics.${category}`;
        const translation = translate(translationKey);
        return translation !== translationKey
            ? translation
            : category
                  .toLowerCase()
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const getScoreDisplay = (report: AuditType) => {
        // Handle null, undefined, or empty values
        if (report.score === null || report.score === undefined) {
            return 'Not retrieved';
        }

        if (report.scoreUnit === 'score') {
            return `${report.score}%`;
        }
        return `${report.score} ${report.scoreUnit}`;
    };

    return (
        <Card
            className={`relative overflow-hidden border shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md ${
                report.scoreStatus === 'success'
                    ? 'border-emerald-200 bg-emerald-50/70'
                    : report.scoreStatus === 'warning'
                      ? 'border-amber-200 bg-amber-50/80'
                      : report.scoreStatus === 'failure' || report.scoreStatus === 'error'
                        ? 'border-red-200 bg-red-50/80'
                        : 'border-slate-200 bg-slate-50/80'
            }`}
        >
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="mb-1 text-base font-semibold leading-tight text-slate-950">
                            {getDisplayName(report.type || 'Unknown')}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">
                                {getDisplayName(report.category || 'Unknown')}
                            </span>
                            {report.subCategory && (
                                <>
                                    <span className="h-0.5 w-0.5 rounded-full bg-slate-400"></span>
                                    <span>{report.subCategory}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getScoreStatusColor(
                                report.scoreStatus || '',
                            )}`}
                        >
                            {report.scoreStatus}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-2xl font-semibold leading-none tracking-tight text-slate-950">
                            {getScoreDisplay(report)}
                        </span>
                    </div>
                </div>
                {report.extraInfos && (
                    <div className="rounded-xl border border-white/70 bg-white/80 p-3">
                        <p className="text-xs leading-relaxed text-slate-700">
                            {report.extraInfos.length > 100
                                ? `${report.extraInfos.substring(0, 100)}...`
                                : report.extraInfos}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default VitalityAuditReportCard;
