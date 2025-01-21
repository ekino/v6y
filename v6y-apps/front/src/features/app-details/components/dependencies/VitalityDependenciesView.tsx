import { ProductOutlined } from '@ant-design/icons';
import { DependencyType } from '@v6y/core-logic';
import VitalityTerms from '@v6y/core-logic/src/config/VitalityTerms';
import * as React from 'react';

import VitalityDynamicLoader from '../../../../commons/components/VitalityDynamicLoader';
import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import { exportAppDependenciesToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter';
import GetApplicationDetailsDependenciesByParams from '../../api/getApplicationDetailsDependenciesByParams';

const VitalityDependenciesBranchGrouper = VitalityDynamicLoader(
    () => import('./VitalityDependenciesBranchGrouper'),
);

interface VitalityDependenciesQueryType {
    isLoading: boolean;
    data?: { getApplicationDetailsDependenciesByParams: DependencyType[] };
}

const VitalityDependenciesView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isAppDetailsDependenciesLoading,
        data: appDetailsDependencies,
    }: VitalityDependenciesQueryType = useClientQuery({
        queryCacheKey: ['getApplicationDetailsDependenciesByParams', `${_id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetApplicationDetailsDependenciesByParams,
                variables: {
                    _id: parseInt(_id as string, 10),
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

    const onExportClicked = () => {
        exportAppDependenciesToCSV(dependencies as DependencyType[]);
    };

    return (
        <VitalitySectionView
            isLoading={isAppDetailsDependenciesLoading}
            isEmpty={!dependencies?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_TITLE}
            avatar={<ProductOutlined />}
            exportButtonLabel={VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_EXPORT_LABEL}
            onExportClicked={onExportClicked}
        >
            <VitalityDependenciesBranchGrouper dependencies={dependencies || []} />
        </VitalitySectionView>
    );
};

export default VitalityDependenciesView;
