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
import GetApplicationDetailsEvolutionsByParams from '../../api/getApplicationDetailsEvolutionsByParams.js';

const VitalityEvolutionBranchGrouper = dynamic(
    () => import('./VitalityEvolutionBranchGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityEvolutionsView = ({}) => {
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

    return (
        <VitalitySectionView
            isLoading={isAppDetailsEvolutionsLoading}
            isEmpty={!evolutions?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_TITLE}
            avatar={<BulbOutlined />}
        >
            <VitalityEvolutionBranchGrouper evolutions={evolutions} />
        </VitalitySectionView>
    );
};

export default VitalityEvolutionsView;
