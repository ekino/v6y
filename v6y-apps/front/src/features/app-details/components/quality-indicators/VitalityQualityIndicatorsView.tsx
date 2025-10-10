import { KeywordType } from '@v6y/core-logic/src/types';
import {
    CompassOutlined,
    DynamicLoader,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import { exportAppQualityIndicatorsToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
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
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isQualityIndicatorsLoading,
        data: dataQualityIndicators,
    } = useClientQuery<{ getApplicationDetailsKeywordsByParams: KeywordType[] }>({
        queryCacheKey: ['getApplicationQualityIndicatorsByParams', `${_id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
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

    const onExportClicked = () => {
        exportAppQualityIndicatorsToCSV(dataSource);
    };

    const { translate } = useTranslationProvider();

    return (
        <VitalitySectionView
            isLoading={isQualityIndicatorsLoading}
            isEmpty={!dataSource?.length}
            title={translate('vitality.appDetailsPage.qualityStatus.title')}
            avatar={<CompassOutlined />}
            exportButtonLabel={translate('vitality.appDetailsPage.qualityStatus.exportLabel')}
            onExportClicked={onExportClicked}
        >
            <VitalityQualityIndicatorBranchGrouper indicators={dataSource} />
        </VitalitySectionView>
    );
};

export default VitalityQualityIndicatorsView;
