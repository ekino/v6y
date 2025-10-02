import { AuditType } from '@v6y/core-logic/src/types';
import {
    DynamicLoader,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';
import * as React from 'react';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';

const VitalityAuditReportsTypeGrouper = DynamicLoader(
    () => import('./VitalityAuditReportsTypeGrouper'),
);

const VitalityAuditReportsView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isAppDetailsAuditReportsLoading,
        data: appDetailsAuditReports,
    } = useClientQuery<{ getApplicationDetailsAuditReportsByParams: AuditType[] }>({
        queryCacheKey: ['getApplicationDetailsAuditReportsByParams', `${_id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetApplicationDetailsAuditReportsByParams,
                variables: {
                    _id: parseInt(_id as string, 10),
                },
            }),
    });

    const auditReports = appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams
        ?.filter(
            (auditReport) =>
                auditReport?.auditHelp?.category?.length && auditReport?.auditHelp?.title?.length,
        )
        ?.map((auditReport) => ({
            ...auditReport,
            ...auditReport?.module,
        }));

    if (isAppDetailsAuditReportsLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-gray-500">Loading audit reports...</div>
                </CardContent>
            </Card>
        );
    }

    if (!auditReports?.length) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-gray-500">No audit reports available</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    📋
                    {translate('vitality.appDetailsPage.audit.reportsTitle') || 'Audit Reports'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <VitalityAuditReportsTypeGrouper auditReports={auditReports} />
            </CardContent>
        </Card>
    );
};

export default VitalityAuditReportsView;
