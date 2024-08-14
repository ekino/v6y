import { ProductOutlined } from '@ant-design/icons';
import React from 'react';

import VitalityEmptyView from '../../../../commons/components/VitalityEmptyView.jsx';
import VitalityLoader from '../../../../commons/components/VitalityLoader.jsx';
import VitalitySectionView from '../../../../commons/components/VitalitySectionView.jsx';
import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView.jsx';
import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView.jsx';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetAppDetailsDependencies from '../../api/getAppDetailsDependencies.js';
import VitalityAppDetailsDependenciesList from './VitalityAppDetailsDependenciesList.jsx';

const VitalityAppDetailsDependenciesView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsDependenciesLoading, data: appDetailsDependencies } =
        useClientQuery({
            queryCacheKey: ['getAppDetailsDependencies', appId],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                    queryPath: GetAppDetailsDependencies,
                    queryParams: {
                        appId,
                    },
                }),
        });

    if (isAppDetailsDependenciesLoading) {
        return <VitalityLoader />;
    }

    const appDetails = appDetailsDependencies?.getAppDetailsDependencies;
    if (!appDetails?.dependencies?.length) {
        return <VitalityEmptyView />;
    }

    return (
        <VitalitySectionView
            title={VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_TITLE}
            avatar={<ProductOutlined />}
        >
            <VitalityTabGrouperView
                name="dependencies_grouper_tab"
                ariaLabelledby="dependencies_grouper_tab_content"
                align="center"
                criteria="status"
                hasAllGroup
                dataSource={appDetails?.dependencies}
                onRenderChildren={(_, data) => (
                    <div id="dependencies_grouper_tab_content">
                        <VitalitySelectGrouperView
                            name="dependencies_grouper_select"
                            criteria="branch"
                            hasAllGroup
                            placeholder={
                                VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_SELECT_PLACEHOLDER
                            }
                            label={VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_SELECT_LABEL}
                            helper={VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_SELECT_HELPER}
                            dataSource={data || []}
                            onRenderChildren={(_, data) => (
                                <VitalityAppDetailsDependenciesList dependencies={data} />
                            )}
                        />
                    </div>
                )}
            />
        </VitalitySectionView>
    );
};

export default VitalityAppDetailsDependenciesView;
