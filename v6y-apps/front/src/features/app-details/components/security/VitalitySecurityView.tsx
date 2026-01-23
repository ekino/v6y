import * as React from 'react';

import { AuditType, DependencyType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Card, CardContent } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';
import GetApplicationDetailsDependenciesByParams from '../../api/getApplicationDetailsDependenciesByParams';

const VitalityCodeSecurityView = DynamicLoader(() => import('./VitalityCodeSecurityView'));

const VitalityDependenciesVulnerabilitiesView = DynamicLoader(
    () => import('./VitalityDependenciesVulnerabilitiesView'),
);

const VitalitySecurityView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);

    const { isLoading: isAppDetailsAuditReportsLoading, data: appDetailsAuditReports } =
        useClientQuery<{ getApplicationDetailsAuditReportsByParams: AuditType[] }>({
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

    const { isLoading: isAppDetailsDependenciesLoading, data: appDetailsDependencies } =
        useClientQuery<{ getApplicationDetailsDependenciesByParams: DependencyType[] }>({
            queryCacheKey: ['getApplicationDetailsDependenciesByParams', `${_id}`],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                    query: GetApplicationDetailsDependenciesByParams,
                    variables: {
                        _id: parseInt(_id as string, 10),
                    },
                }),
        });

    const auditReports = appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams || [];
    const dependencies = appDetailsDependencies?.getApplicationDetailsDependenciesByParams
        ?.filter((dependency) => dependency?.statusHelp?.category && dependency?.statusHelp?.title)
        ?.map((dependency) => ({
            ...dependency,
            ...dependency?.statusHelp,
            status: dependency.status,
        }));

    const isLoading = isAppDetailsAuditReportsLoading || isAppDetailsDependenciesLoading;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="flex items-center justify-center p-12">
                        <div className="text-sm font-medium text-slate-500">
                            {translate('vitality.appDetailsPage.loadingStates.security')}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <VitalityCodeSecurityView auditReports={auditReports} />

            <VitalityDependenciesVulnerabilitiesView dependencies={dependencies || []} />
        </div>
    );
};

export default VitalitySecurityView;
