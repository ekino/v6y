import { BulbOutlined } from '@ant-design/icons';
import React from 'react';

import VitalitySectionView from '../../../commons/components/VitalitySectionView.jsx';
import VitalityTabGrouperView from '../../../commons/components/VitalityTabGrouperView.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetApplicationDetailsEvolutionsByParams from '../api/getApplicationDetailsEvolutionsByParams.js';
import VitalityAppDetailsEvolutionList from './evolutions/VitalityAppDetailsEvolutionList.jsx';

const VitalityAppDetailsEvolutionsView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsEvolutionsLoading, data: appDetailsEvolutions } = useClientQuery(
        {
            queryCacheKey: ['getApplicationDetailsEvolutionsByParams', appId],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                    queryPath: GetApplicationDetailsEvolutionsByParams,
                    queryParams: {
                        appId,
                    },
                }),
        },
    );

    const evolutions =
        (
            appDetailsEvolutions?.getApplicationDetailsEvolutionsByParams?.filter(
                (evolution) => evolution.evolutionHelp?.status,
            ) || []
        ).map((evolution) => ({
            ...evolution,
            status: evolution.evolutionHelp?.status,
        })) || [];

    return (
        <VitalitySectionView
            isLoading={isAppDetailsEvolutionsLoading}
            isEmpty={!evolutions?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_TITLE}
            avatar={<BulbOutlined />}
        >
            <VitalityTabGrouperView
                name="evolutions_grouper_tab"
                ariaLabelledby="evolutions_grouper_tab_content"
                align="center"
                criteria="status"
                hasAllGroup
                dataSource={evolutions}
                onRenderChildren={(_, data) => (
                    <div id="evolutions_grouper_tab_content">
                        <VitalityAppDetailsEvolutionList evolutions={data} />
                    </div>
                )}
            />
        </VitalitySectionView>
    );
};

export default VitalityAppDetailsEvolutionsView;
