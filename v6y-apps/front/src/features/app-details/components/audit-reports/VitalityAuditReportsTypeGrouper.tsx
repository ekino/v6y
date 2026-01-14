import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types';
import { Badge, useTranslationProvider } from '@v6y/ui-kit-front';
import { Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';

const getScoreStatusVariant = (scoreStatus: string | null | undefined) => {
    switch (scoreStatus) {
        case 'success':
            return 'success';
        case 'warning':
            return 'warning';
        case 'error':
            return 'error';
        default:
            return 'default';
    }
};

const getScoreStatusIcon = (scoreStatus: string | null | undefined) => {
    switch (scoreStatus) {
        case 'success':
            return '✓';
        case 'warning':
            return '⚠';
        case 'error':
            return '✕';
        default:
            return 'ⓘ';
    }
};

const getScoreTextColor = (scoreStatus: string | null | undefined) => {
    switch (scoreStatus) {
        case 'success':
            return 'text-green-600';
        case 'warning':
            return 'text-orange-600';
        case 'error':
            return 'text-red-600';
        default:
            return 'text-gray-900';
    }
};

const VitalityAuditReportsTypeGrouper = ({ auditReports }: { auditReports: AuditType[] }) => {
    const { translate } = useTranslationProvider();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {auditReports.map((report) => (
                <Card
                    key={report._id}
                    className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <CardHeader className="pb-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base font-semibold text-gray-900 flex-1">
                                {report.type || translate('vitality.appDetailsPage.audit.title')}
                            </CardTitle>
                            {report.scoreStatus && (
                                <Badge variant={getScoreStatusVariant(report.scoreStatus)}>
                                    {report.scoreStatus}
                                </Badge>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                                {report.category ?? ''}
                                {report.subCategory ? ` - ${report.subCategory}` : ''}
                            </p>
                            {report.auditStatus && (
                                <p className="text-xs text-gray-500">
                                    {translate('vitality.appDetailsPage.audit.status')}:{' '}
                                    <span
                                        className={`font-medium ${
                                            report.auditStatus === 'success'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {report.auditStatus}
                                    </span>
                                </p>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                            {report.score === null || report.score === undefined ? (
                                <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md text-sm font-medium w-full text-center">
                                    {translate('vitality.appDetailsPage.audit.scoreNotRetrieved')}
                                </span>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 flex-1">
                                        <span
                                            className={`text-xl font-bold ${getScoreTextColor(report.scoreStatus)}`}
                                        >
                                            {getScoreStatusIcon(report.scoreStatus)}
                                        </span>
                                        <span
                                            className={`text-2xl font-bold ${getScoreTextColor(report.scoreStatus)}`}
                                        >
                                            {report.score}
                                            {report.scoreUnit === 'score'
                                                ? '%'
                                                : ` ${report.scoreUnit || ''}`}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {report.extraInfos && (
                            <p className="text-sm text-gray-700 border-t pt-2">
                                {report.extraInfos}
                            </p>
                        )}

                        {(report.dateStart || report.dateEnd) && (
                            <div className="text-xs text-gray-500 border-t pt-2 space-y-1">
                                {report.dateStart && (
                                    <div>
                                        {translate('vitality.appDetailsPage.audit.dateStart')}:{' '}
                                        {new Date(report.dateStart).toLocaleDateString()}
                                    </div>
                                )}
                                {report.dateEnd && (
                                    <div>
                                        {translate('vitality.appDetailsPage.audit.dateEnd')}:{' '}
                                        {new Date(report.dateEnd).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        )}

                        {report.module?.branch && (
                            <div className="text-xs text-gray-600 border-t pt-2">
                                <span className="font-medium">Branch:</span>{' '}
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                                    {report.module.branch}
                                </span>
                            </div>
                        )}

                        {report.module?.url && (
                            <div className="border-t pt-2">
                                <a
                                    href={report.module.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-xs underline inline-flex items-center gap-1"
                                >
                                    {translate('vitality.appDetailsPage.audit.viewSource') ||
                                        'View Source'}
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default VitalityAuditReportsTypeGrouper;
