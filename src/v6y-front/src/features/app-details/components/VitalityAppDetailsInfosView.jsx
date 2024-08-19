import { InfoOutlined } from '@ant-design/icons';
import React from 'react';

import VitalityLinks from '../../../commons/components/VitalityLinks.jsx';
import VitalitySectionView from '../../../commons/components/VitalitySectionView.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetAppDetailsInfos from '../api/getAppDetailsInfos.js';

const VitalityAppDetailsInfosView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsInfosLoading, data: appDetailsInfos } = useClientQuery({
        queryCacheKey: ['getAppDetailsInfos', appId],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetAppDetailsInfos,
                queryParams: {
                    appId,
                },
            }),
    });

    const appInfos = appDetailsInfos?.getAppDetailsInfos;
    const appTitle =
        appInfos?.name?.length && appInfos?.acronym?.length
            ? `${appInfos?.acronym} - ${appInfos?.name}`
            : VitalityTerms.VITALITY_APP_DETAILS_INFOS_TITLE;

    return (
        <VitalitySectionView
            isLoading={isAppDetailsInfosLoading}
            isEmpty={!appInfos?.name?.length || !appInfos?.acronym?.length}
            title={appTitle}
            description={appInfos?.description}
            avatar={<InfoOutlined />}
        >
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
