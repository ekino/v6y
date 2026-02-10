import * as React from 'react';

import { EvolutionType } from '@v6y/core-logic/src/types/EvolutionType';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Card, CardContent } from '@v6y/ui-kit-front/components/molecules/Card';

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

    const { isLoading: isAppDetailsEvolutionsLoading, data: appDetailsEvolutions } =
        useClientQuery<{ getApplicationDetailsEvolutionsByParams: EvolutionType[] }>({
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
                evolution?.module?.branch &&
                evolution?.evolutionHelp?.category &&
                evolution?.evolutionHelp?.title &&
                evolution?.evolutionHelp?.status,
        )
        ?.map((evolution) => ({
            ...evolution,
            ...evolution?.module,
            ...evolution?.evolutionHelp,
        }));

    if (isAppDetailsEvolutionsLoading) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex items-center justify-center p-12">
                    <div className="text-sm font-medium text-slate-500">
                        {translate('vitality.appDetailsPage.loadingStates.evolutions')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!evolutions?.length) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    <div className="text-4xl mb-2">💡</div>
                    <div className="text-base font-semibold text-slate-900">
                        {translate('vitality.appDetailsPage.emptyStates.evolutions.title')}
                    </div>
                    <div className="text-sm text-slate-500">
                        {translate('vitality.appDetailsPage.emptyStates.evolutions.description')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
                <VitalityEvolutionBranchGrouper evolutions={evolutions || []} />
            </CardContent>
        </Card>
    );
};

export default VitalityEvolutionsView;
