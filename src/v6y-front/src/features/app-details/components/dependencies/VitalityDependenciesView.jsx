import { ProductOutlined } from '@ant-design/icons';
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
import GetApplicationDetailsDependenciesByParams from '../../api/getApplicationDetailsDependenciesByParams.js';

const VitalityDependenciesBranchGrouper = dynamic(
    () => import('./VitalityDependenciesBranchGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityDependenciesView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const { isLoading: isAppDetailsDependenciesLoading, data: appDetailsDependencies } =
        useClientQuery({
            queryCacheKey: ['getApplicationDetailsDependenciesByParams', appId],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                    queryPath: GetApplicationDetailsDependenciesByParams,
                    queryParams: {
                        appId,
                    },
                }),
        });

    const dependencies = appDetailsDependencies?.getApplicationDetailsDependenciesByParams
        ?.filter(
            (dependency) =>
                dependency?.module?.branch?.length &&
                dependency?.statusHelp?.category?.length &&
                dependency?.statusHelp?.title?.length,
        )
        ?.map((dependency) => ({
            ...dependency,
            ...dependency?.module,
            ...dependency?.statusHelp,
            status: dependency.status,
        }));

    return (
        <VitalitySectionView
            isLoading={isAppDetailsDependenciesLoading}
            isEmpty={!dependencies?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_TITLE}
            avatar={<ProductOutlined />}
        >
            <VitalityDependenciesBranchGrouper dependencies={dependencies} />
        </VitalitySectionView>
    );
};

export default VitalityDependenciesView;
