import { DashboardOutlined } from '@ant-design/icons';
import React from 'react';

import VitalitySectionView from '../../../commons/components/VitalitySectionView.jsx';
import VitalitySelectGrouperView from '../../../commons/components/VitalitySelectGrouperView.jsx';
import VitalityTags from '../../../commons/components/VitalityTags.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetAppDetailsQualityReports from '../api/getAppDetailsQualityReports.js';

const VitalityAppDetailsQualityView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsQualityLoading, data: appDetailsQuality } = useClientQuery({
        queryCacheKey: ['getAppDetailsQualityReports', appId],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetAppDetailsQualityReports,
                queryParams: {
                    appId,
                },
            }),
    });

    const appDetails = appDetailsQuality?.getAppDetailsQualityReports;

    return (
        <VitalitySectionView
            isLoading={isAppDetailsQualityLoading}
            isEmpty={!appDetails?.keywords?.length && !appDetails?.qualityGates?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_STATUS_TITLE}
            avatar={<DashboardOutlined />}
        >
            <VitalitySelectGrouperView
                name="quality_grouper_select"
                criteria="branch"
                hasAllGroup
                placeholder={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_SELECT_PLACEHOLDER}
                label={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_SELECT_LABEL}
                helper={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_SELECT_HELPER}
                dataSource={[...(appDetails?.keywords || []), ...(appDetails?.qualityGates || [])]}
                onRenderChildren={(_, data) => <VitalityTags align="center" tags={data} />}
            />
        </VitalitySectionView>
    );
};

export default VitalityAppDetailsQualityView;
