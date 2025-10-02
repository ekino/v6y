import { KeywordType } from '@v6y/core-logic/src/types';
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
import GetApplicationDetailsQualityIndicatorsByParams from '../../api/getApplicationDetailsQualityIndicatorsByParams';

const VitalityQualityIndicatorBranchGrouper = DynamicLoader(
    () => import('./VitalityQualityIndicatorBranchGrouper'),
);

const VitalityQualityIndicatorsView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isQualityIndicatorsLoading,
        data: dataQualityIndicators,
    } = useClientQuery<{ getApplicationDetailsKeywordsByParams: KeywordType[] }>({
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
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-gray-500">Loading quality indicators...</div>
                </CardContent>
            </Card>
        );
    }

    if (!dataSource?.length) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-gray-500">No quality indicators available</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    🧭
                    {translate('vitality.appDetailsPage.qualityStatus.title') || 'Quality Indicators'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <VitalityQualityIndicatorBranchGrouper indicators={dataSource} />
            </CardContent>
        </Card>
    );
};

export default VitalityQualityIndicatorsView;
