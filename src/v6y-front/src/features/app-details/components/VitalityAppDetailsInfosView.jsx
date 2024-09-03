import { InfoOutlined } from '@ant-design/icons';
import React from 'react';

import VitalityLinks from '../../../commons/components/VitalityLinks.jsx';
import VitalityLoadMoreList from '../../../commons/components/VitalityLoadMoreList.jsx';
import VitalitySectionView from '../../../commons/components/VitalitySectionView.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import VitalityAppListItem from '../../app-list/components/VitalityAppListItem.jsx';
import GetApplicationDetailsByParams from '../api/GetApplicationDetailsByParams.js';

const VitalityAppDetailsInfosView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsInfosLoading, data: appDetailsInfos } = useClientQuery({
        queryCacheKey: ['getApplicationDetailsByParams', appId],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetApplicationDetailsByParams,
                queryParams: {
                    appId,
                },
            }),
    });

    const appInfos = appDetailsInfos?.getApplicationDetailsByParams;

    return (
        <VitalitySectionView
            isLoading={isAppDetailsInfosLoading}
            isEmpty={!appInfos?.name?.length || !appInfos?.acronym?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_INFOS_TITLE}
            description=""
            avatar={<InfoOutlined />}
        >
            <VitalityLoadMoreList
                bordered={false}
                dataSource={[{}]}
                renderItem={() => <VitalityAppListItem app={appInfos} canOpenDetails={false} />}
            />
            <VitalityLinks
                align="center"
                links={[
                    ...(appInfos?.links || []),
                    {
                        label: appInfos?.repo?.name,
                        value: appInfos?.repo?.webUrl,
                    },
                ]}
            />
        </VitalitySectionView>
    );
};

export default VitalityAppDetailsInfosView;
