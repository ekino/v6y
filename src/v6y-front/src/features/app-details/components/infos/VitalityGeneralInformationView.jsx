import { InfoOutlined } from '@ant-design/icons';
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
import GetApplicationDetailsInfosByParams from '../../api/getApplicationDetailsInfosByParams.js';

const VitalityAppInfos = dynamic(
    () => import('../../../../commons/components/application-info/VitalityAppInfos.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityGeneralInformationView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsInfosLoading, data: appDetailsInfos } = useClientQuery({
        queryCacheKey: ['getApplicationDetailsInfoByParams', appId],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetApplicationDetailsInfosByParams,
                queryParams: {
                    appId,
                },
            }),
    });

    const appInfos = appDetailsInfos?.getApplicationDetailsInfoByParams;

    return (
        <VitalitySectionView
            isLoading={isAppDetailsInfosLoading}
            isEmpty={!appInfos?.name?.length || !appInfos?.acronym?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_INFOS_TITLE}
            description=""
            avatar={<InfoOutlined />}
        >
            <VitalityAppInfos app={appInfos} canOpenDetails={false} />
        </VitalitySectionView>
    );
};

export default VitalityGeneralInformationView;
