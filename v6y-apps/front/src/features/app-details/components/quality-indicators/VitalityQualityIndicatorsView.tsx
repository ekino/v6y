import { KeywordType } from '@v6y/core-logic/src/types';
import { CompassOutlined, useNavigationAdapter } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDynamicLoader from '../../../../commons/components/VitalityDynamicLoader';
import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../../commons/config/VitalityTerms';
import { exportAppQualityIndicatorsToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsQualityIndicatorsByParams from '../../api/getApplicationDetailsQualityIndicatorsByParams';

const VitalityQualityIndicatorBranchGrouper = VitalityDynamicLoader(
    () => import('./VitalityQualityIndicatorBranchGrouper'),
);

interface VitalityQualityIndicatorsQueryType {
    isLoading: boolean;
    data?: { getApplicationDetailsKeywordsByParams: KeywordType[] };
}

const VitalityQualityIndicatorsView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isQualityIndicatorsLoading,
        data: dataQualityIndicators,
    }: VitalityQualityIndicatorsQueryType = useClientQuery({
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

    return (
        <VitalitySectionView
            isLoading={isQualityIndicatorsLoading}
            isEmpty={!dataSource?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_STATUS_TITLE}
            avatar={<CompassOutlined />}
            exportButtonLabel={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_INDICATORS_EXPORT_LABEL}
            onExportClicked={onExportClicked}
        >
            <VitalityQualityIndicatorBranchGrouper indicators={dataSource} />
        </VitalitySectionView>
    );
};

export default VitalityQualityIndicatorsView;
