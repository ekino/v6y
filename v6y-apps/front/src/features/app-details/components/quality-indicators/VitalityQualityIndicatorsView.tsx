import * as React from 'react';

import { KeywordType } from '@v6y/core-logic/src/types/KeywordType';
import { Card, CardContent } from '@v6y/ui-kit-front/components/molecules/Card';
import DynamicLoader from '@v6y/ui-kit/components/organisms/app/DynamicLoader.tsx';
import useNavigationAdapter from '@v6y/ui-kit/hooks/useNavigationAdapter.tsx';
import useTranslationProvider from '@v6y/ui-kit/translation/useTranslationProvider.ts';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsQualityIndicatorsByParams from '../../api/getApplicationDetailsQualityIndicatorsByParams';

const VitalityQualityIndicatorBranchGrouper = DynamicLoader(
    () => import('./VitalityQualityIndicatorBranchGrouper'),
);

const VitalityQualityIndicatorsView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);

    const { isLoading: isQualityIndicatorsLoading, data: dataQualityIndicators } = useClientQuery<{
        getApplicationDetailsKeywordsByParams: KeywordType[];
    }>({
        queryCacheKey: ['getApplicationQualityIndicatorsByParams', `${_id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetApplicationDetailsQualityIndicatorsByParams,
                variables: {
                    _id: parseInt(_id as string, 10),
                },
            }),
    });

    const dataSource: KeywordType[] =
        dataQualityIndicators?.getApplicationDetailsKeywordsByParams
            ?.filter((indicator) => indicator?.module?.branch?.length)
            ?.map((indicator) => ({
                ...indicator,
                ...indicator?.module,
            })) || [];

    if (isQualityIndicatorsLoading) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex items-center justify-center p-12">
                    <div className="text-sm font-medium text-slate-500">
                        {translate('vitality.appDetailsPage.loadingStates.qualityIndicators')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!dataSource?.length) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-base font-semibold text-slate-900">
                        {translate('vitality.appDetailsPage.emptyStates.qualityIndicators.title')}
                    </div>
                    <div className="text-sm text-slate-500">
                        {translate(
                            'vitality.appDetailsPage.emptyStates.qualityIndicators.description',
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
                <VitalityQualityIndicatorBranchGrouper indicators={dataSource} />
            </CardContent>
        </Card>
    );
};

export default VitalityQualityIndicatorsView;
