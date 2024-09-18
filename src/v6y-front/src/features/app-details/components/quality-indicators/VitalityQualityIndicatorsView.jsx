import { BulbOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader.jsx';
import VitalitySectionView from '../../../../commons/components/VitalitySectionView.jsx';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetApplicationDetailsQualityIndicatorsByParams from '../../api/getApplicationDetailsQualityIndicatorsByParams.js';

const VitalityQualityIndicatorBranchGrouper = dynamic(
    () => import('./VitalityQualityIndicatorBranchGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityQualityIndicatorsView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isQualityIndicatorsLoading, data: dataQualityIndicators } = useClientQuery({
        queryCacheKey: ['getApplicationQualityIndicatorsByParams'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetApplicationDetailsQualityIndicatorsByParams,
                queryParams: {
                    appId,
                },
            }),
    });

    const dataSource = dataQualityIndicators?.getApplicationDetailsKeywordsByParams
        ?.filter((indicator) => indicator?.module?.branch?.length)
        ?.map((indicator) => ({
            ...indicator,
            ...indicator?.module,
        }));

    return (
        <VitalitySectionView
            isLoading={isQualityIndicatorsLoading}
            isEmpty={!dataSource?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_STATUS_TITLE}
            avatar={<BulbOutlined />}
        >
            <VitalityQualityIndicatorBranchGrouper indicators={dataSource} />
        </VitalitySectionView>
    );
};

export default VitalityQualityIndicatorsView;
