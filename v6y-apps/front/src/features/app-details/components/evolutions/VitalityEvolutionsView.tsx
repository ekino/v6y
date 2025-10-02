import { EvolutionType } from '@v6y/core-logic/src/types';
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
import GetApplicationDetailsEvolutionsByParams from '../../api/getApplicationDetailsEvolutionsByParams';

const VitalityEvolutionBranchGrouper = DynamicLoader(
    () => import('./VitalityEvolutionBranchGrouper'),
);

const VitalityEvolutionsView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isAppDetailsEvolutionsLoading,
        data: appDetailsEvolutions,
    } = useClientQuery<{ getApplicationDetailsEvolutionsByParams: EvolutionType[] }>({
        queryCacheKey: ['getApplicationDetailsEvolutionsByParams', `${_id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetApplicationDetailsEvolutionsByParams,
                variables: {
                    _id: parseInt(_id as string, 10),
                },
            }),
    });

    const evolutions = appDetailsEvolutions?.getApplicationDetailsEvolutionsByParams
        ?.filter(
            (evolution) =>
                evolution?.module?.branch?.length &&
                evolution?.evolutionHelp?.category?.length &&
                evolution?.evolutionHelp?.title?.length &&
                evolution?.evolutionHelp?.status?.length,
        )
        ?.map((evolution) => ({
            ...evolution,
            ...evolution?.module,
            ...evolution?.evolutionHelp,
        }));

    if (isAppDetailsEvolutionsLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-gray-500">Loading evolutions...</div>
                </CardContent>
            </Card>
        );
    }

    if (!evolutions?.length) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-gray-500">No evolutions available</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    💡
                    {translate('vitality.appDetailsPage.evolutions.title') || 'Evolutions'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <VitalityEvolutionBranchGrouper evolutions={evolutions || []} />
            </CardContent>
        </Card>
    );
};

export default VitalityEvolutionsView;
