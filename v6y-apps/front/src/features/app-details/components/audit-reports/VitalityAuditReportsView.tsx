import { AuditType } from '@v6y/core-logic/src/types';
import {
    DynamicLoader,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import { Card, CardContent } from '@v6y/ui-kit-front';
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

    if (isAppDetailsAuditReportsLoading) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex items-center justify-center p-12">
                    <div className="text-sm font-medium text-slate-500">{translate('vitality.appDetailsPage.loadingStates.auditReports')}</div>
                </CardContent>
            </Card>
        );
    }

    if (!appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams?.length) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    <div className="text-4xl mb-2">📋</div>
                    <div className="text-base font-semibold text-slate-900">{translate('vitality.appDetailsPage.emptyStates.auditReports.title')}</div>
                    <div className="text-sm text-slate-500">{translate('vitality.appDetailsPage.emptyStates.auditReports.description')}</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
                <VitalityAuditReportsTypeGrouper auditReports={appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams || []} />
            </CardContent>
        </Card>
    );
};

export default VitalityAuditReportsView;
