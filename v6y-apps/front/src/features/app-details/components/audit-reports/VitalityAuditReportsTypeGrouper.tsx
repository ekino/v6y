import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types/AuditType';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@v6y/ui-kit-front/components/molecules/Card';

import { getScoreStatusColor } from '../../../../commons/utils/StatusUtils';

const VitalityAuditReportsTypeGrouper = ({ auditReports }: { auditReports: AuditType[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {auditReports.map((report) => (
                <Card
                    key={report._id}
                    className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-semibold text-gray-900 capitalize">
                                {report.type}
                            </CardTitle>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded border ${getScoreStatusColor(report.scoreStatus || '')}`}
                            >
                                {report.scoreStatus}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {report.category} - {report.subCategory}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-2xl font-bold text-gray-900">
                                {report.score}
                                {report.scoreUnit === 'score' ? '%' : ` ${report.scoreUnit}`}
                            </span>
                            <span className="text-sm text-gray-500 capitalize">
                                {report.auditStatus}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700">{report.extraInfos}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default VitalityAuditReportsTypeGrouper;
