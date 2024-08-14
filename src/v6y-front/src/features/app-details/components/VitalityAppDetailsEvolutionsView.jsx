import { BulbOutlined } from '@ant-design/icons';
import React from 'react';

import VitalityEmptyView from '../../../commons/components/VitalityEmptyView.jsx';
import VitalityHelpList from '../../../commons/components/VitalityHelpList.jsx';
import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalitySectionView from '../../../commons/components/VitalitySectionView.jsx';
import VitalitySelectGrouperView from '../../../commons/components/VitalitySelectGrouperView.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetAppDetailsEvolutions from '../api/getAppDetailsEvolutions.js';

const VitalityAppDetailsEvolutionsView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsEvolutionsLoading, data: appDetailsEvolutions } = useClientQuery(
        {
            queryCacheKey: ['getAppDetailsEvolutions', appId],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                    queryPath: GetAppDetailsEvolutions,
                    queryParams: {
                        appId,
                    },
                }),
        },
    );

    if (isAppDetailsEvolutionsLoading) {
        return <VitalityLoader />;
    }

    const appDetails = appDetailsEvolutions?.getAppDetailsEvolutions;
    if (!appDetails?.evolutions?.length) {
        return <VitalityEmptyView />;
    }

    return (
        <VitalitySectionView
            title={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_TITLE}
            avatar={<BulbOutlined />}
        >
            <VitalitySelectGrouperView
                name="evolutions_grouper_select"
                criteria="branch"
                hasAllGroup
                placeholder={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_SELECT_PLACEHOLDER}
                label={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_SELECT_LABEL}
                helper={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_SELECT_HELPER}
                dataSource={appDetails?.evolutions || []}
                onRenderChildren={(_, data) => <VitalityHelpList helps={data} />}
            />
        </VitalitySectionView>
    );
};

export default VitalityAppDetailsEvolutionsView;
