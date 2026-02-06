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
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                report.scoreStatus === 'success'
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-500'
                    : report.scoreStatus === 'warning'
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-l-4 border-l-amber-500'
                      : report.scoreStatus === 'failure' || report.scoreStatus === 'error'
                        ? 'bg-gradient-to-br from-red-50 to-rose-50 border-l-4 border-l-red-500'
                        : 'bg-gradient-to-br from-slate-50 to-gray-50 border-l-4 border-l-slate-400'
            }`}
        >
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-bold text-gray-900 mb-0.5 leading-tight">
                            {getDisplayName(report.type || 'Unknown')}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <span className="font-medium">
                                {getDisplayName(report.category || 'Unknown')}
                            </span>
                            {report.subCategory && (
                                <>
                                    <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
                                    <span>{report.subCategory}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span
                            className={`px-2 py-0.5 text-sm font-semibold rounded-full uppercase tracking-wide ${getScoreStatusColor(
                                report.scoreStatus || '',
                            )}`}
                        >
                            {report.scoreStatus}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                        <span className="text-md font-bold text-gray-900 leading-none">
                            {getScoreDisplay(report)}
                        </span>
                    </div>
                </div>
                {report.extraInfos && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/40">
                        <p className="text-xs text-gray-700 leading-relaxed">
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
