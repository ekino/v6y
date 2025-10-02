import { DependencyType } from '@v6y/core-logic/src/types';
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
import GetApplicationDetailsDependenciesByParams from '../../api/getApplicationDetailsDependenciesByParams';

const VitalityDependenciesBranchGrouper = DynamicLoader(
    () => import('./VitalityDependenciesBranchGrouper'),
);

const VitalityDependenciesView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isAppDetailsDependenciesLoading,
        data: appDetailsDependencies,
    } = useClientQuery<{ getApplicationDetailsDependenciesByParams: DependencyType[] }>({
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
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-gray-500">Loading dependencies...</div>
                </CardContent>
            </Card>
        );
    }

    if (!dependencies?.length) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-gray-500">No dependencies available</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    📦
                    {translate('vitality.appDetailsPage.dependencies.title') || 'Dependencies'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <VitalityDependenciesBranchGrouper dependencies={dependencies || []} />
            </CardContent>
        </Card>
    );
};

export default VitalityDependenciesView;
