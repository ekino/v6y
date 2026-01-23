import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types';
import { useTranslationProvider } from '@v6y/ui-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';

import { getScoreStatusColor } from '../../../../commons/utils/StatusUtils';

const VitalityCodeSecurityView = ({ auditReports }: { auditReports: AuditType[] }) => {
    const { translate } = useTranslationProvider();

    const codeSecurityReports = auditReports?.filter((report) => report.type === 'Code-Security');

    if (!codeSecurityReports?.length) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        {translate('vitality.appDetailsPage.codeSecurity.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    <div className="text-4xl mb-2">🔒</div>
                    <div className="text-base font-semibold text-slate-900">
                        {translate('vitality.appDetailsPage.emptyStates.codeSecurity.title')}
                    </div>
                    <div className="text-sm text-slate-500">
                        {translate('vitality.appDetailsPage.emptyStates.codeSecurity.description')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {translate('vitality.appDetailsPage.codeSecurity.title')}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {codeSecurityReports.map((report) => (
                    <Card
                        key={report._id}
                        className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-sm font-semibold text-gray-900 capitalize">
                                    {report.category}
                                </CardTitle>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded border ${getScoreStatusColor(report.scoreStatus || '')}`}
                                >
                                    {report.scoreStatus}
                                </span>
                            </div>
                            {report.subCategory && (
                                <p className="text-xs text-gray-600 mt-1">{report.subCategory}</p>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {report.module?.path && (
                                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono break-words">
                                    {report.module.path}
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 capitalize">
                                    {report.auditStatus}
                                </span>
                            </div>
                            {report.extraInfos && (
                                <p className="text-xs text-gray-700">{report.extraInfos}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VitalityCodeSecurityView;
