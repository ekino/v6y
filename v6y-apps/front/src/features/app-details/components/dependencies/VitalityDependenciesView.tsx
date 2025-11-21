import { DependencyType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Card, CardContent } from '@v6y/ui-kit-front';
import * as React from 'react';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsDependenciesByParams from '../../api/getApplicationDetailsDependenciesByParams';

const VitalityDependenciesBranchGrouper = DynamicLoader(
    () => import('./VitalityDependenciesBranchGrouper'),
);

const VitalityDependenciesView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);

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

    const dependencies = appDetailsDependencies?.getApplicationDetailsDependenciesByParams
        ?.filter(
            (dependency) =>
                dependency?.module?.branch?.length &&
                dependency?.statusHelp?.category?.length &&
                dependency?.statusHelp?.title?.length,
        )
        ?.map((dependency) => ({
            ...dependency,
            ...dependency?.module,
            ...dependency?.statusHelp,
            status: dependency.status,
        }));

    if (isAppDetailsDependenciesLoading) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex items-center justify-center p-12">
                    <div className="text-sm font-medium text-slate-500">
                        {translate('vitality.appDetailsPage.loadingStates.dependencies')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!dependencies?.length) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    <div className="text-4xl mb-2">📦</div>
                    <div className="text-base font-semibold text-slate-900">
                        {translate('vitality.appDetailsPage.emptyStates.dependencies.title')}
                    </div>
                    <div className="text-sm text-slate-500">
                        {translate('vitality.appDetailsPage.emptyStates.dependencies.description')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
                <VitalityDependenciesBranchGrouper dependencies={dependencies || []} />
            </CardContent>
        </Card>
    );
};

export default VitalityDependenciesView;
